from typing import AsyncGenerator
import os
import random
from interview_prep_ai.ai_providers.openai_provider import OpenAIProvider
from interview_prep_ai.ai_providers.anthropic_provider import AnthropicProvider
from interview_prep_ai.ai_providers.gemini_provider import GeminiProvider
from interview_prep_ai.ai_providers.groq_provider import GroqProvider

class AIProviderManager:
    """Manages AI providers and their failover."""
    
    def __init__(self):
        # We instantiate all providers with env keys. 
        # Missing keys will crash or fail validate(), which is expected for prod
        self.providers = {}
        
        try:
            self.providers["openai"] = OpenAIProvider()
        except Exception:
            pass
        
        try:
            self.providers["anthropic"] = AnthropicProvider()
        except Exception:
            pass
            
        try:
            self.providers["gemini"] = GeminiProvider()
        except Exception:
            pass
            
        try:
            self.providers["groq"] = GroqProvider()
        except Exception:
            pass
            
    def get_provider_chain(self, task_type: str) -> list[str]:
        if task_type == "code_review":
            return ["anthropic", "openai", "gemini"]
        elif task_type == "interview_coach":
            return ["openai", "anthropic", "gemini"]
        elif task_type == "fast_summary":
            return ["gemini", "groq", "openai"]
        elif task_type == "small_prompt":
            return ["groq", "gemini", "openai"]
        else:
            return ["openai", "anthropic", "gemini", "groq"]

class AIService:
    """High level service for executing AI workloads."""
    
    def __init__(self, manager: AIProviderManager = None):
        self.manager = manager or AIProviderManager()
        
    async def stream_deterministic(
        self, 
        task_type: str, 
        messages: list[dict], 
        system_content: str = "",
        track_usage_callback = None
    ) -> AsyncGenerator[str, None]:
        chain = self.manager.get_provider_chain(task_type)
        
        for provider_name in chain:
            provider = self.manager.providers.get(provider_name)
            if not provider:
                continue
                
            try:
                # Assuming provider implements stream_chat
                async for chunk in provider.stream_chat(messages, system_content=system_content):
                    yield chunk
                
                # If we get here, generation succeeded. Track usage if a callback is provided.
                if track_usage_callback:
                    await track_usage_callback(provider_name)
                return
                
            except Exception as e:
                print(f"[AIService] Provider {provider_name} failed: {e}. Trying next...")
                continue
                
        yield "[Error] All configured AI providers failed to fulfill the request. Please contact support."

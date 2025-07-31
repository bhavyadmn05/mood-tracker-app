import requests
import streamlit as st
from typing import Optional, Dict

class DatabaseAuth:
  def __init__(self, api_base_url: str = "http://localhost:5173"):
      self.api_base_url = api_base_url
  
  def validate_user(self, email: str) -> Optional[Dict]:
      """
      Validate user against the Next.js database
      """
      try:
          response = requests.post(
              f"{self.api_base_url}/api/streamlit/users",
              json={"email": email},
              timeout=10
          )
          
          if response.status_code == 200:
              data = response.json()
              return data.get("user")
          else:
              return None
              
      except requests.exceptions.RequestException as e:
          st.error(f"Connection error: {e}")
          return None
  
  def get_user_by_email(self, email: str) -> Optional[Dict]:
      """
      Get user data by email
      """
      try:
          response = requests.get(
              f"{self.api_base_url}/api/streamlit/users",
              params={"email": email},
              timeout=10
          )
          
          if response.status_code == 200:
              data = response.json()
              return data.get("user")
          else:
              return None
              
      except requests.exceptions.RequestException as e:
          st.error(f"Connection error: {e}")
          return None
  
  def authenticate_user(self, email: str) -> bool:
      """
      Authenticate user and store in session state
      """
      user = self.validate_user(email)
      if user:
          st.session_state.authenticated = True
          st.session_state.user_data = user
          st.session_state.username = user["name"]
          st.session_state.user_email = email
          return True
      return False

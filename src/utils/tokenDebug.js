// Debug helper to check token storage and expiration
export const debugToken = () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    console.warn("❌ NO TOKEN FOUND IN LOCALSTORAGE");
    return null;
  }
  
  console.log("✅ Token found in localStorage");
  console.log("Token length:", token.length);
  
  try {
    // Parse JWT
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT format (should have 3 parts)");
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    console.log("📋 Token Payload:", payload);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp - now;
    
    if (expiresIn < 0) {
      console.warn(`⏰ Token EXPIRED ${Math.abs(expiresIn)} seconds ago`);
      return null;
    }
    
    console.log(`⏰ Token expires in ${expiresIn} seconds (~${Math.round(expiresIn / 60)} minutes)`);
    console.log("✅ Token is VALID");
    
    return payload;
  } catch (e) {
    console.error("❌ Error parsing token:", e);
    return null;
  }
};

// Test the API request directly
export const testMechanicAPI = async (mechanicId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    console.error("❌ No token available");
    return;
  }
  
  try {
    console.log(`\n🧪 Testing API call to /api/mechanic/${mechanicId}/workorders`);
    
    const response = await fetch(`http://localhost:5175/api/mechanic/${mechanicId}/workorders`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log("Response Data:", data);
    
    if (response.ok) {
      console.log("✅ API call successful!");
    } else {
      console.error(`❌ API call failed with status ${response.status}`);
    }
    
    return data;
  } catch (e) {
    console.error("❌ Error testing API:", e);
  }
};

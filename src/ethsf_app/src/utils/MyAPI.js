const API_URL = "http://localhost:5000"
const API_KEY = "ethsf123"

const headers = {
  'Accept': 'application/json',
  'Authorization': API_KEY,
}

// use service
export const userService = (params) =>
  fetch(`${API_URL}/api/userService`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

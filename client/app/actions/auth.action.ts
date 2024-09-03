import { API_BASE_URL } from "../constants";

export const registerUser = async (data: FormData) => {
    console.log("data >", data);
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        // Check if response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Parse the JSON response
        return { data: "OK" }; // Return the result
    } catch (error) {
        console.log("what", error);
    }
};

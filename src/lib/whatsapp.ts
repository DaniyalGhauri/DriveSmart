// Callmebot API for WhatsApp
const WHATSAPP_API_URL = 'https://api.callmebot.com/whatsapp.php';

export const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    try {
        // Format the phone number (remove any spaces, dashes, or country code)
        const formattedPhone = phoneNumber.replace(/[\s-+]/g, '');
        
        // For testing, use a hardcoded test number
        // In production, you would use the actual phone number
        const testPhone = '+923051424517'; // Replace with your WhatsApp number for testing
        
        // Construct the API URL with the test phone number
        const url = `${WHATSAPP_API_URL}?phone=${testPhone}&text=${encodeURIComponent(message)}`;
        
        console.log('Sending WhatsApp message to:', testPhone);
        console.log('Message:', message);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('WhatsApp API Error:', errorText);
            throw new Error(`Failed to send WhatsApp message: ${errorText}`);
        }
        
        const result = await response.text();
        console.log('WhatsApp API Response:', result);
        
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return false;
    }
}; 
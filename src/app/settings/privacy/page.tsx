import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl min-h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      
      <Card className="bg-card">
        <CardContent className="p-6 prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>
          
          <h3>2. Information We Collect Through Your Use of Our Services</h3>
          <p>When you use our Services, we collect information about you in the following general categories:</p>
          <ul>
            <li><strong>Location Information:</strong> We collect precise or approximate location data from your mobile device or web browser.</li>
            <li><strong>Transaction Information:</strong> We collect transaction details related to your use of our Services.</li>
            <li><strong>Usage and Preference Information:</strong> We collect information about how you and site visitors interact with our Services.</li>
          </ul>

          <h3>3. Sharing of Information</h3>
          <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
          <ul>
            <li>With Event Hosts and Venues to enable them to provide the Services you request.</li>
            <li>With third parties to provide you a service you requested through a partnership or promotional offering.</li>
          </ul>

          <h3>4. Contact Us</h3>
          <p>If you have any questions about this Privacy Statement, please contact us at info.zenbourg@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}

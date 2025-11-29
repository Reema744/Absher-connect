import { useRoute, useLocation, Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, FileText, CreditCard, Calendar, Users, Plane, 
  AlertTriangle, Clock, MapPin, CheckCircle, XCircle,
  Car, Building2, Shield, Info
} from "lucide-react";

const serviceIcons: Record<string, any> = {
  passport: FileText,
  "national-id": CreditCard,
  "driving-license": Car,
  violation: AlertTriangle,
  appointment: Calendar,
  appointments: Calendar,
  delegation: Users,
  delegations: Users,
  hajj: Plane,
  traffic: Car,
  "civil-affairs": Building2,
  travel: Plane,
  security: Shield,
};

const serviceTitles: Record<string, string> = {
  passport: "Passport Service",
  "national-id": "National ID Service",
  "driving-license": "Driving License Service",
  violation: "Traffic Violation",
  appointment: "Appointment Details",
  appointments: "Appointments Service",
  delegation: "Delegation Details",
  delegations: "Delegations Service",
  hajj: "Hajj Registration",
  traffic: "Traffic Services",
  "civil-affairs": "Civil Affairs",
  travel: "Travel Services",
  security: "Security Services",
};

const serviceDescriptions: Record<string, { summary: string; features: string[] }> = {
  passport: {
    summary: "Manage your Saudi passport, apply for new issuance, renewal, or replacement. Track your passport status and validity.",
    features: [
      "Apply for a new passport",
      "Renew existing passport",
      "Report lost or damaged passport",
      "Track passport application status",
      "Update passport information",
    ],
  },
  "national-id": {
    summary: "Your National ID is your primary identification document in Saudi Arabia. Manage issuance, renewal, and updates here.",
    features: [
      "Apply for National ID",
      "Renew National ID",
      "Update personal information",
      "Request replacement for lost/damaged ID",
      "View ID status and expiry",
    ],
  },
  "driving-license": {
    summary: "Manage your Saudi driving license including applications, renewals, and international permits.",
    features: [
      "Apply for new driving license",
      "Renew driving license",
      "Request international driving permit",
      "View license details and validity",
      "Report lost or damaged license",
    ],
  },
  violation: {
    summary: "View and pay your traffic violations. Take advantage of early payment discounts.",
    features: [
      "View violation details",
      "Pay violation fines",
      "Object to violations",
      "View payment history",
      "Get early payment discounts",
    ],
  },
  appointment: {
    summary: "Manage your scheduled appointments for various government services.",
    features: [
      "View appointment details",
      "Reschedule appointments",
      "Cancel appointments",
      "Get appointment reminders",
      "View location and directions",
    ],
  },
  appointments: {
    summary: "Book and manage appointments for various Absher services at government offices across Saudi Arabia.",
    features: [
      "Book new appointments",
      "View upcoming appointments",
      "Reschedule or cancel bookings",
      "Receive appointment reminders",
      "Find nearest service centers",
    ],
  },
  delegation: {
    summary: "View details of delegations granted to or by you for performing services on behalf of others.",
    features: [
      "View delegation details",
      "Manage delegation permissions",
      "Set delegation expiry dates",
      "Revoke delegations",
      "Track delegation history",
    ],
  },
  delegations: {
    summary: "Grant or receive authority to perform government services on behalf of family members or others.",
    features: [
      "Grant delegation to others",
      "Receive delegation authority",
      "Manage active delegations",
      "Set permissions and limits",
      "Track delegation history",
    ],
  },
  hajj: {
    summary: "Check your Hajj eligibility, register for the upcoming Hajj season, and track your application status.",
    features: [
      "Check Hajj eligibility",
      "Register for Hajj",
      "Track registration status",
      "View Hajj history",
      "Access Hajj guidelines",
    ],
  },
  traffic: {
    summary: "Access all traffic-related services including vehicle registration, violations, and driving permits.",
    features: [
      "View and pay traffic violations",
      "Register vehicles",
      "Transfer vehicle ownership",
      "Renew vehicle registration",
      "Request traffic reports",
      "View points on license",
    ],
  },
  "civil-affairs": {
    summary: "Manage civil registry services including birth certificates, marriage, divorce, and family records.",
    features: [
      "Request birth certificates",
      "Register marriages",
      "Update family records",
      "Request death certificates",
      "Manage dependent information",
      "Update address records",
    ],
  },
  travel: {
    summary: "Manage travel permissions, exit/re-entry visas, and travel-related services for you and your dependents.",
    features: [
      "Apply for exit/re-entry visa",
      "Manage travel permissions",
      "Track visa applications",
      "View travel history",
      "Manage dependent travel",
      "Emergency travel services",
    ],
  },
  security: {
    summary: "Access security-related services including criminal records, good conduct certificates, and security clearances.",
    features: [
      "Request criminal record certificate",
      "Apply for security clearance",
      "Report security concerns",
      "Request good conduct certificate",
      "Manage security permits",
      "View security status",
    ],
  },
};

const servicesWithUserData = ["passport", "national-id", "driving-license", "hajj"];

const servicesRequiringId = ["violation", "appointment", "delegation"];

function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string | Date) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    active: { variant: "default", label: "Active" },
    expiring_soon: { variant: "destructive", label: "Expiring Soon" },
    expired: { variant: "destructive", label: "Expired" },
    unpaid: { variant: "destructive", label: "Unpaid" },
    paid: { variant: "default", label: "Paid" },
    scheduled: { variant: "default", label: "Scheduled" },
    completed: { variant: "secondary", label: "Completed" },
    cancelled: { variant: "outline", label: "Cancelled" },
    not_registered: { variant: "secondary", label: "Not Registered" },
    registered: { variant: "default", label: "Registered" },
    not_eligible: { variant: "outline", label: "Not Eligible" },
  };

  const config = variants[status] || { variant: "outline", label: status };

  return <Badge variant={config.variant} data-testid="badge-status">{config.label}</Badge>;
}

function ServiceDescription({ serviceType }: { serviceType: string }) {
  const description = serviceDescriptions[serviceType];
  
  if (!description) {
    return (
      <div className="text-muted-foreground">
        <p>Service information is not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground" data-testid="text-service-summary">{description.summary}</p>
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Available Features
        </h4>
        <ul className="space-y-2">
          {description.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span data-testid={`text-feature-${index}`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PassportDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Passport Number</p>
          <p className="font-medium" data-testid="text-passport-number">{data.passportNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Issue Date</p>
          <p className="font-medium" data-testid="text-issue-date">{formatDate(data.issueDate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expiry Date</p>
          <p className="font-medium" data-testid="text-expiry-date">{formatDate(data.expiryDate)}</p>
        </div>
      </div>
    </div>
  );
}

function NationalIdDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">ID Number</p>
          <p className="font-medium" data-testid="text-id-number">{data.idNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Issue Date</p>
          <p className="font-medium" data-testid="text-issue-date">{formatDate(data.issueDate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expiry Date</p>
          <p className="font-medium" data-testid="text-expiry-date">{formatDate(data.expiryDate)}</p>
        </div>
      </div>
    </div>
  );
}

function DrivingLicenseDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">License Number</p>
          <p className="font-medium" data-testid="text-license-number">{data.licenseNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">License Type</p>
          <p className="font-medium capitalize" data-testid="text-license-type">{data.licenseType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expiry Date</p>
          <p className="font-medium" data-testid="text-expiry-date">{formatDate(data.expiryDate)}</p>
        </div>
      </div>
    </div>
  );
}

function ViolationDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Violation Number</p>
          <p className="font-medium" data-testid="text-violation-number">{data.violationNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Violation Type</p>
          <p className="font-medium" data-testid="text-violation-type">{data.violationType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="font-medium" data-testid="text-amount">{data.amount} SAR</p>
        </div>
        {data.discountAmount && (
          <div>
            <p className="text-sm text-muted-foreground">Discount Amount</p>
            <p className="font-medium text-green-600" data-testid="text-discount">{data.discountAmount} SAR</p>
          </div>
        )}
        {data.discountExpiry && (
          <div>
            <p className="text-sm text-muted-foreground">Discount Expires</p>
            <p className="font-medium text-destructive" data-testid="text-discount-expiry">{formatDateTime(data.discountExpiry)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Violation Date</p>
          <p className="font-medium" data-testid="text-violation-date">{formatDateTime(data.violationDate)}</p>
        </div>
        {data.location && (
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium flex items-center gap-1" data-testid="text-location">
              <MapPin className="w-4 h-4" />
              {data.location}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Appointment Type</p>
          <p className="font-medium" data-testid="text-appointment-type">{data.appointmentType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Date & Time</p>
          <p className="font-medium flex items-center gap-1" data-testid="text-appointment-date">
            <Clock className="w-4 h-4" />
            {formatDateTime(data.appointmentDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="font-medium flex items-center gap-1" data-testid="text-location">
            <MapPin className="w-4 h-4" />
            {data.location}
          </p>
        </div>
        {data.notes && (
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="font-medium" data-testid="text-notes">{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DelegationDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Delegation Type</p>
          <p className="font-medium capitalize" data-testid="text-delegation-type">{data.delegationType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Delegate Name</p>
          <p className="font-medium" data-testid="text-delegate-name">{data.delegateName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Delegate National ID</p>
          <p className="font-medium" data-testid="text-delegate-id">{data.delegateNationalId}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="font-medium" data-testid="text-start-date">{formatDate(data.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expiry Date</p>
          <p className="font-medium" data-testid="text-expiry-date">{formatDate(data.expiryDate)}</p>
        </div>
      </div>
    </div>
  );
}

function HajjDetails({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Eligibility</p>
          <div className="flex items-center gap-2" data-testid="text-eligibility">
            {data.eligible ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">Eligible</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">Not Eligible</span>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Registration Status</p>
          <StatusBadge status={data.registrationStatus} />
        </div>
        {data.lastHajjYear && (
          <div>
            <p className="text-sm text-muted-foreground">Last Hajj Year</p>
            <p className="font-medium" data-testid="text-last-hajj">{data.lastHajjYear}</p>
          </div>
        )}
        {data.registrationYear && (
          <div>
            <p className="text-sm text-muted-foreground">Registration Year</p>
            <p className="font-medium" data-testid="text-registration-year">{data.registrationYear}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:type/:id?");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const serviceType = params?.type || "";
  const serviceId = params?.id;

  const requiresId = servicesRequiringId.includes(serviceType);
  const hasIdWhenRequired = !requiresId || (requiresId && !!serviceId);
  const canFetchData = servicesWithUserData.includes(serviceType) || (requiresId && hasIdWhenRequired);
  const shouldShowData = canFetchData && hasIdWhenRequired;

  const getApiUrl = () => {
    if (!user || !shouldShowData) return "";
    
    switch (serviceType) {
      case "passport":
        return `/api/services/passport/${user.id}`;
      case "national-id":
        return `/api/services/national-id/${user.id}`;
      case "driving-license":
        return `/api/services/driving-license/${user.id}`;
      case "violation":
        return serviceId ? `/api/services/violations/${user.id}/${serviceId}` : "";
      case "appointment":
        return serviceId ? `/api/services/appointments/${user.id}/${serviceId}` : "";
      case "delegation":
        return serviceId ? `/api/services/delegations/${user.id}/${serviceId}` : "";
      case "hajj":
        return `/api/services/hajj/${user.id}`;
      default:
        return "";
    }
  };

  const apiUrl = getApiUrl();

  const { data, isLoading, error } = useQuery({
    queryKey: [apiUrl],
    enabled: !!user && !!serviceType && shouldShowData && !!apiUrl,
  });

  const handleStartService = () => {
    toast({
      title: "Service Started",
      description: `Your ${serviceTitles[serviceType] || serviceType} request has been initiated.`,
    });
  };

  const Icon = serviceIcons[serviceType] || FileText;
  const title = serviceTitles[serviceType] || serviceType.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (shouldShowData && isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-10 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (shouldShowData && error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                <p>Failed to load service details</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderDataDetails = () => {
    if (!data) return null;
    
    switch (serviceType) {
      case "passport":
        return <PassportDetails data={data} />;
      case "national-id":
        return <NationalIdDetails data={data} />;
      case "driving-license":
        return <DrivingLicenseDetails data={data} />;
      case "violation":
        return <ViolationDetails data={data} />;
      case "appointment":
        return <AppointmentDetails data={data} />;
      case "delegation":
        return <DelegationDetails data={data} />;
      case "hajj":
        return <HajjDetails data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle data-testid="text-service-title">{title}</CardTitle>
                <CardDescription>View and manage your {serviceType.replace("-", " ")} details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {shouldShowData && data && (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Information</h3>
                  {renderDataDetails()}
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">About This Service</h3>
                  <ServiceDescription serviceType={serviceType} />
                </div>
              </>
            )}
            {!shouldShowData && (
              <ServiceDescription serviceType={serviceType} />
            )}
          </CardContent>
        </Card>

        <Button 
          className="w-full h-12" 
          size="lg"
          onClick={handleStartService}
          data-testid="button-start-service"
        >
          Start Service
        </Button>
      </div>
    </div>
  );
}

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
  AlertTriangle, Clock, MapPin, CheckCircle, XCircle
} from "lucide-react";

const serviceIcons: Record<string, any> = {
  passport: FileText,
  "national-id": CreditCard,
  "driving-license": CreditCard,
  violation: AlertTriangle,
  appointment: Calendar,
  delegation: Users,
  hajj: Plane,
};

const serviceTitles: Record<string, string> = {
  passport: "Passport Service",
  "national-id": "National ID Service",
  "driving-license": "Driving License Service",
  violation: "Traffic Violation",
  appointment: "Appointment Details",
  delegation: "Delegation Details",
  hajj: "Hajj Registration",
};

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

function PassportDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
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
    <div className="space-y-4">
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
    <div className="space-y-4">
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
    <div className="space-y-4">
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
    <div className="space-y-4">
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
    <div className="space-y-4">
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
    <div className="space-y-4">
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

  const getApiUrl = () => {
    if (!user) return "";
    
    switch (serviceType) {
      case "passport":
        return `/api/services/passport/${user.id}`;
      case "national-id":
        return `/api/services/national-id/${user.id}`;
      case "driving-license":
        return `/api/services/driving-license/${user.id}`;
      case "violation":
        return `/api/services/violations/${user.id}/${serviceId}`;
      case "appointment":
        return `/api/services/appointments/${user.id}/${serviceId}`;
      case "delegation":
        return `/api/services/delegations/${user.id}/${serviceId}`;
      case "hajj":
        return `/api/services/hajj/${user.id}`;
      default:
        return "";
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [getApiUrl()],
    enabled: !!user && !!serviceType,
  });

  const handleStartService = () => {
    toast({
      title: "Service Started",
      description: `Your ${serviceTitles[serviceType]} request has been initiated.`,
    });
  };

  const Icon = serviceIcons[serviceType] || FileText;

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
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

  if (error) {
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

  const renderDetails = () => {
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
        return <p>Unknown service type</p>;
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
                <CardTitle data-testid="text-service-title">{serviceTitles[serviceType]}</CardTitle>
                <CardDescription>View and manage your {serviceType.replace("-", " ")} details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderDetails()}
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

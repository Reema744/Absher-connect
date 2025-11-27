import DashboardGrid from "../DashboardGrid";

export default function DashboardGridExample() {
  return (
    <DashboardGrid onServiceClick={(id) => console.log("Service clicked:", id)} />
  );
}

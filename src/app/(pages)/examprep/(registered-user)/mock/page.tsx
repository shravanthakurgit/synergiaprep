
import TestListing from "@/components/TestListing";

export default function MockPage() {
  return (
    <TestListing
      type="mock"
      title="Mock Tests"
      description="Mock Papers with detailed solutions"
      gradientFrom="#ecfdf5"
      gradientTo="#d1fae5"
      borderColor="#d1fae5"
      primaryColor="#059669" // emerald-600
    />
  );
}
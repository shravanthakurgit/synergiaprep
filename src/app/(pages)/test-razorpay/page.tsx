import PaymentButton from "@/components/PaymentButton";
export default function TestRazorpayPage() {

  return (
    <>
      <PaymentButton amount={100} courseId={"1234"} couponCode="" />
    </>
  );
}

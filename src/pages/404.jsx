import { Container } from "@/components/UI/atoms/container";

export default function PageNotFound() {
  return (
    <>
      <Container className="py-28">
        <img
          src="/unavailable.png"
          alt="Access Denied"
          className="block w-52 h-52 mx-auto"
        />
        <h2 className="text-h3 leading-10 font-sora font-bold text-center my-6">
          Oops, Page Not Found
        </h2>
      </Container>
    </>
  );
}

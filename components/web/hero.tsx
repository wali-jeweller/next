import Image from "next/image";
import { LinkButton } from "./link-button";
import { H1, Text } from "@/components/ui/typography";

export function Hero() {
  return (
    <div className="inset-0 min-h-svh h-svh w-full relative">
      <Image
        src="/hero_2.png"
        alt="Hero"
        className="object-cover h-full w-full"
        width={1920}
        height={1080}
        preload
      />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 gap-4 text-center">
        <H1 className="text-4xl lg:text-9xl text-white isolate text-shadow-lg">
          Al-Wali Jewellers
        </H1>
        <Text className="max-w-4xl mx-auto text-white px-8 isolate">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius enim
          debitis, distinctio soluta perspiciatis neque recusandae rem ad nisi.
          Laborum ipsam repudiandae minus architecto maiores quia sit temporibus
          enim sapiente.
        </Text>
        <LinkButton href="/products" className="border-white bg-white">
          Shop Now
        </LinkButton>
      </div>
    </div>
  );
}

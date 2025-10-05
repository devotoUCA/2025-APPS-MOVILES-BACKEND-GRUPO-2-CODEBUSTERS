import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: "Palo de Golf",
        price: "$1200",
        image: "https://example.com/palo.jpg",
        description: "Palo de Golf.",
      },
      {
        title: "Cámara Digital",
        price: "$25000",
        image: "https://example.com/camara.jpg",
        description: "Cámara de alta resolución con zoom óptico.",
      },
    ],
  });
}

main()
  .then(() => console.log("Seed completed"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());

const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const baseUri = 'https://fvbogq5bv5.execute-api.us-east-1.amazonaws.com/prod/metadata/0x6f3B255eFA6b2d4133c4F208E98E330e8CaF86f3/';

async function main() {
  for (let i = 0; i < 3250; i++) {
    const response = await fetch(`${baseUri}${i}`);
    let attributeData = [];

    if (response.ok) {
      const json = await response.json();
      console.info(json);

      let pillar = await prisma.chimeraPillar.create({
        data: {
          name: json.name,
          description: json.description,
          image: json.image,
          tokenId: i
        }
      });

      console.log(`** Created ChimeraPillar #${i} **`);

      for (let j = 0; j < json.attributes.length; j++) {
        attributeData.push({
          trait_type: json.attributes[j].trait_type,
          value: json.attributes[j].value,
          chimeraPillarId: pillar.id
        });
      }

      await prisma.traitType.createMany({
        data: attributeData
      });

      console.log(`** Created ChimeraPillar #${i} traits **`);
    }
  }
}

main();

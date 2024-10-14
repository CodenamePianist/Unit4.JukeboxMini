const { faker } = require("@faker-js/faker");
const prisma = require("./index");

const seed = async (numUsers = 3, numPlaylists = 5) => {
  // Seed the file with three users
  for (let i = 0; i < numUsers; i++) {
    // Each user has 5 playlists
    const playlists = Array.from({ length: numPlaylists }, (_, j) => {
      const name = faker.internet.displayName();
      return {
        name,
        description: `${name}${i}`,
      };
    });
    // Create a single user with nested playlists
    await prisma.user.create({
      data: {
        username: faker.person.fullName(),
        // Create playlists from schema
        playlists: { create: playlists },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

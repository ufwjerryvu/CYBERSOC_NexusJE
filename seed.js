import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "erik@hai.com",
      username: "ehai",
      isAdmin: false,
    },
  });
  console.log("User created:", user);

  // Create a post linked to that user
  const post = await prisma.post.create({
    data: {
      title: "Test Post",
      description: "i need a job",
      categories: "PEP Hours",
      user: { connect: { id: user.id } } // connect relation correctly
    },
  });
  console.log("Post created:", post);

  // Create a comment linked to the post and user
  const comment = await prisma.comment.create({
    data: {
      content: "This is a test comment",
      images: JSON.stringify([]),
      user: { connect: { id: user.id } },
      post: { connect: { id: post.id } },
    },
  });
  console.log("Comment created:", comment);

  // Fetch posts with user and comments
  const postsWithComments = await prisma.post.findMany({
    include: {
      user: true,
      comments: true,
    },
  });
  console.log("Posts with comments:", postsWithComments);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

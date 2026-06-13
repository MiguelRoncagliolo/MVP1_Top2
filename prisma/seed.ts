async function main() {
  console.log(
    "No seed data is inserted by default. Use this script to add demo cases once DATABASE_URL and Supabase are configured.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

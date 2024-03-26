export async function sampleServerAction({ id, name }) {
  console.log(`Function called from server with id: ${id} and name: ${name}`);
  return {
    success: true
  };
}
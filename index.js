import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "./nillion/nillionOrgConfig.js";

// Use postSchema.js to create a new collection schema
// Update SCHEMA_ID to the schema id of your new collection
const SCHEMA_ID = "6920d8c0-8ba6-4fb4-a604-77cfd219c783";

// Web3 Experience Survey Data to add to the collection
// $allot signals that the name years_in_web3 field will be encrypted
// Each node will have a different encrypted $share of encrypted field
const data = [
  {
    email: { $allot: "vitalik@example.com" }, // will be encrypted to a $share
    password: { $allot: "secret123" }, // will be encrypted to a $share, minLength: 6
  },

  {
    email: { $allot: "satoshi@example.com" }, // will be encrypted to a $share
    password: { $allot: "secret123" }, // will be encrypted to a $share, minLength: 6
  },
];

async function main() {
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(data);
    console.log(
      "👀 Data written to nodes:",
      JSON.stringify(dataWritten, null, 2)
    );

    // Get the ids of the SecretVault records created
    const newIds = [
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
    ];
    console.log("uploaded record ids:", newIds);

    // Read all collection data from the nodes, decrypting the specified fields
    const decryptedCollectionData = await collection.readFromNodes({});

    // Log first 5 records
    // console.log(
    //   "Most recent records",
    //   decryptedCollectionData.slice(0, data.length)
    // );
  } catch (error) {
    console.error("❌ SecretVaultWrapper error:", error.message);
    process.exit(1);
  }
}

main();

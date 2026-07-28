import "dotenv/config";
import { bootstrapSeed } from "./bootstrap";


const seedLogger = (message: string) => {
    console.log("SEEDS: ", message);
}


async function main() {
    seedLogger("🌱 Seed start...")
    const handlers = Object.values(bootstrapSeed);
    for (const seed of handlers) {
        seedLogger(`${seed.message.start}`);
        await seed.handler();
        seedLogger(`${seed.message.end}`);
    }
    seedLogger("✅ Seed Done")
}



main();
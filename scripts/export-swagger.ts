/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { swaggerDocument } from '../src/swagger';

const outputPath = path.join(__dirname, '../openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerDocument, null, 2));
console.log(`OpenAPI spec exported to ${outputPath}`);
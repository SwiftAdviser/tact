import { ContractABI } from "ton-core";
import { CompilerContext } from "../context";
import { PackageFileFormat } from "../packaging/fileFormat";
import { getType } from "../types/resolveDescriptors";
import { Writer } from "../utils/Writer";

export function writeReport(ctx: CompilerContext, pkg: PackageFileFormat) {
    let w = new Writer();
    let abi = JSON.parse(pkg.abi) as ContractABI;
    w.write(`
        # TACT Compilation Report
        Contract: ${pkg.name}
        BOC Size: ${Buffer.from(pkg.code, 'base64').length} bytes
    `);
    w.append();

    // Types
    w.write(`# Types`);
    w.write('Total Types: ' + abi.types!.length);
    w.append();
    for (let t of abi.types!) {
        let tt = getType(ctx, t.name);
        w.write(`## ${t.name}`);
        w.write(`TLB: \`${tt.tlb!}\``);
        w.write(`Signature: \`${tt.signature!}\``);
        w.append();
    }

    // Get methods
    w.write(`# Get Methods`);
    w.write('Total Get Methods: ' + abi.getters!.length);
    w.append();
    for (let t of abi.getters!) {
        w.write(`## ${t.name}`);
        for (let arg of t.arguments!) {
            w.write(`Argument: ${arg.name}`);
        }
        w.append();
    }

    // Error Codes
    w.write(`# Error Codes`);
    for (let t in abi.errors!) {
        w.write(`${t}: ${abi.errors![parseInt(t, 10)].message}`);
    }

    return w.end();
}
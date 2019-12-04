import {Entity, Column, PrimaryGeneratedColumn, Index, OneToMany} from "typeorm";
import {PublicKey} from "@stellarbeat/js-stellar-domain";

import NodeSnapShot from "./NodeSnapShot";

@Entity("node_v2")
export default class NodeStorageV2 {

    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column("varchar", {length: 56})
    @Index({unique: true})
    publicKey: PublicKey;

    // @ts-ignore
    @OneToMany()
    snapShots: NodeSnapShot[] = [];

    latestSnapshot?: NodeSnapShot;

    @Column("timestamptz")
    dateDiscovered: Date = new Date();

    constructor(publicKey: PublicKey) {
        this.publicKey = publicKey;
    }
}
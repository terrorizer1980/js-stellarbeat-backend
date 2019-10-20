import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import PublicKeyStorage from "./PublicKeyStorage";

@Entity()
export default class NodeMeasurementDayV2 {

    @PrimaryColumn("timestamptz")
    day: Date;

    @ManyToOne(type => PublicKeyStorage)
    @PrimaryColumn("integer")
    publicKey: PublicKeyStorage;

    @Column("smallint", {default: 0})
    isActiveCount: number = 0;

    @Column("smallint", {default: 0})
    isValidatingCount: number = 0;

    @Column("smallint", {default: 0})
    isFullValidatorCount: number = 0;

    @Column("smallint", {default: 0})
    isOverloadedCount: number = 0;

    @Column("int")
    indexAverage: number = 0; //future proof
    
    @Column("smallint", {default: 0})
    crawlCount:number = 0;

    constructor(publicKey:PublicKeyStorage, day = new Date()) {
        this.publicKey = publicKey;
        this.day = day;
    }
}
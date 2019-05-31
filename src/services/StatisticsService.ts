import {NodeMeasurementRepository} from "../repositories/NodeMeasurementRepository";
import * as Sentry from "@sentry/node";
import {Network} from "@stellarbeat/js-stellar-domain";
import {CrawlRepository} from "../repositories/CrawlRepository";
import NodeMeasurement from "../entities/NodeMeasurement";
import Crawl from "../entities/Crawl";

export class StatisticsService {
    protected _nodeMeasurementRepository:NodeMeasurementRepository;
    protected _crawlRepository: CrawlRepository;

    constructor(nodeMeasurementRepository: NodeMeasurementRepository,
                crawlRepository: CrawlRepository){
        this._nodeMeasurementRepository = nodeMeasurementRepository;
        this._crawlRepository = crawlRepository;
    }

    async saveMeasurementsAndUpdateAverages(network:Network, crawl:Crawl) {
        let nodeMeasurements = network.nodes.map(node => {
                let nodeMeasurement = new NodeMeasurement(node.publicKey, crawl.time);
                nodeMeasurement.isActive = node.active;
                nodeMeasurement.isOverLoaded = node.overLoaded;
                nodeMeasurement.isValidating = node.isValidating;

                return nodeMeasurement;
        });

        await this._nodeMeasurementRepository.save(nodeMeasurements);

        let oneDayAverages = await this._nodeMeasurementRepository.findActivityValidatingAndLoadCountLatestXDays(1);
        let sevenDayAverages = await this._nodeMeasurementRepository.findActivityValidatingAndLoadCountLatestXDays(7);

        oneDayAverages.forEach((measurementAverage) => { //every node has at least one record
            let node = network.getNodeByPublicKey(measurementAverage.public_key);
            if (node === undefined) {
                Sentry.captureException("statistics for unknown node: " + measurementAverage.public_key);
                return;
            }

            node.statistics.active24HoursPercentage = Number(measurementAverage.active_avg);
            node.statistics.overLoaded24HoursPercentage =  Number(measurementAverage.over_loaded_avg);
            node.statistics.validating24HoursPercentage =  Number(measurementAverage.validating_avg);
        });

        sevenDayAverages.forEach((measurementAverage) => {//every node has one record
            let node = network.getNodeByPublicKey(measurementAverage.public_key);
            if (node === undefined) {
                Sentry.captureException("statistics for unknown node: " + measurementAverage.public_key);
                return;
            }

            node.statistics.active7DaysPercentage = Number(measurementAverage.active_avg);
            node.statistics.overLoaded7DaysPercentage =  Number(measurementAverage.over_loaded_avg);
            node.statistics.validating7DaysPercentage =  Number(measurementAverage.validating_avg);
        });
    }
}
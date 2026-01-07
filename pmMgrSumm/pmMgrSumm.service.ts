import { Injectable } from '@nestjs/common';
import PmMgrRepo from './pmMgrSumm.repo';

@Injectable()
export class PmMgrSummService {
    constructor(private readonly pmMgrRepo: PmMgrRepo) { }

    async PmData(mgrid: string, duein: string) {
        try {
            const data = await this.pmMgrRepo.getPmMgrSumm(mgrid, duein);
            const transformedData = data.map((site: any) => {
                const totalTasks = site.numtasks || 0;
                const doneTasks = site.numtasksdone || 0;
                const perc = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 100;
                const tasks = [
                    {
                        duein: site.duein,
                        pm: {
                            total: totalTasks,
                            done: doneTasks,
                            perc: perc,
                        },
                    },
                ];
                return {
                    techid: site.techid,
                    tasks: tasks,
                };
            });
            return { taskcounts: transformedData };
        } catch (error) {
            throw error;
        }
    }
}


import { Injectable } from '@nestjs/common';
import taskrepo from "./task.repo";



@Injectable()
export class TaskService {
    constructor(private taskrepo: taskrepo) { }

    async PmData(pmHeaderId) {
        try {
            const { headerData, pmtasks } = await this.taskrepo.pmSData(pmHeaderId);

           
            const headerItem = headerData[0]; 
            const transformedHeaderData = {
                numtasks: headerItem.NUMTASKS,
                numtasksdone: headerItem.NUMTASKSDONE
            };

           
            const transformedData = pmtasks.map(item => {
                const lowerCaseItem:any= {};

                // Transform existing keys to lowercase
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        lowerCaseItem[key.toLowerCase()] = item[key];
                    }
                }
                const kwname = lowerCaseItem['specifictask'];
                let cfdSpecificTaskDefinition = {};
                if(kwname === null || kwname=== ''){
                    cfdSpecificTaskDefinition={}
                }else{
                    if (this.isKwNameInGroup(kwname)) {
                        cfdSpecificTaskDefinition = {
                            kwvalues: "",
                            kwcategory: "PM Specific Tasks",
                            kwdatatype: "NUMBER",
                            kwdecimalplaces: "2",
                            kwdefaultvalue: "",
                            kwdescription: lowerCaseItem['kwdescription'],
                            kwname,
                        };
                } 
        }
        lowerCaseItem.cfd_specific_task_definition=cfdSpecificTaskDefinition;
                
                lowerCaseItem['sortorder'] = '';
                lowerCaseItem['statusnamestamp'] = '';

                lowerCaseItem['widgetStatus'] = lowerCaseItem['widget_status'];

                if(lowerCaseItem['widgetStatus']?.toUpperCase()==="IN PROGRESS"){
                    lowerCaseItem['widgetStatus'] = "WIP";
                }

                lowerCaseItem['widgetId'] = lowerCaseItem['widgetid']
                return lowerCaseItem;
            });

            return {
                headerData: transformedHeaderData, 
                pmtasks: transformedData
            };

        } catch (error) {
            throw error;
        }
    }
    private isKwNameInGroup(kwname: string): boolean {
        const kwnameGroup = [
            "BATTERIES_JAR %", "GENERATOR_BATTERY_VOLTS", "SITE_DC_PLANTLOAD_VOLTS_24",
            "SITE_DC_PLANTLOAD_VOLTS_48", "SITE_DC_PLANTLOAD_VOLTS_UL_24", "SITE_DC_PLANTLOAD_VOLTS_UL_48",
            "SITE_DC_PLANTLOAD_AMPS_24", "SITE_DC_PLANTLOAD_AMPS_48"
        ];

        return kwnameGroup.some(name => kwname.startsWith(name));
    }
}

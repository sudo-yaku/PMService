export const queries = {
  getPmBySite: `SELECT 
    pmd.LIST_NAME AS listname, 
    pmd.FREQUENCY AS frequency,
    pmd.SWITCH_NAME AS switch,  
    pmd.SITE_NAME AS site_name, 
    pmd.SITE_UNID AS site_unid, 
    pmd.NUM_OF_TASKS AS numtasks, 
    pmd.NUM_OF_TASKS_DONE AS numtasksdone, 
    TO_CHAR(pmd.START_DATE) AS startdate, 
    TO_CHAR(pmd.END_DATE) AS stopdate, 
    pmd.PM_UNID AS pm_unid, 
    pmd.PMD_WIDGET_ID AS pmd_widget_id, 
    pw.STATUS AS pmd_widget_status
FROM 
    pmd_widget_pm_details pmd
LEFT JOIN 
    pmd_widget pw
ON 
    pmd.PMD_WIDGET_ID = pw.PMD_WIDGET_ID
WHERE 
    pmd.SITE_UNID = :siteUnid
AND 
    (pmd.CREATED_ON, pmd.PM_UNID) IN (
        SELECT 
            MAX(CREATED_ON) AS latest_create_date,
            PM_UNID
        FROM 
            pmd_widget_pm_details
        WHERE 
            SITE_UNID = :siteUnid
        GROUP BY 
            PM_UNID
    )`,
};

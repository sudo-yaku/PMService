export const queries = {
    getTestById: ` 
    SELECT
    c.CATEGORY_NAME AS category,
    inv.KW_DESCRIPTION AS kwdescription,
    inv.KW_CATEGORY AS kwcategory,
    inv.KW_NAME AS kwname,
    a.HELP_TEXT AS cfd_helptext_converted,
    to_char(g.COMMENTS) AS comments,
     'I' AS defaultstatus,
    g.META_CREATED_BY AS meta_createdby,
    g.META_CREATED_DATE AS meta_createddate,
    g.META_LAST_UPDATED_BY AS meta_lastupdateby,
    to_char(g.META_LAST_UPDATED_DATE) AS meta_lastupdatedate,
    a.MINUTES_EST AS minutes_est,
    a.TASK_NAME AS taskname,
    d.STATUS_ID AS status,
    g.STATUSIDSTAMP AS statusidstamp,
    g.META_UNIVERSAL_ID AS task_unid,
    to_char(g.STATUSTIMESTAMP) AS statustimestamp,
    a.SPECIFIC_DATA_NAME as specifictask,
    g.SPECIFIC_DATA_VALUE as specifictask_value,
    g.PM_HEADER_ID AS PM_UNID,  
    pwpd.PMD_WIDGET_ID AS widgetId,
    pmdw.STATUS AS WIDGET_STATUS
FROM 
    opspm.PM_LOCATION_TASK g
LEFT JOIN 
OPSPM.PM_TASK_LIST_ITEM a ON g.TASK_ID = a.TASK_ID
LEFT JOIN
PMD_WIDGET_PM_DETAILS pwpd ON pwpd.TASK_UNID = g.META_UNIVERSAL_ID
LEFT JOIN
PMD_WIDGET pmdw ON pwpd.PMD_WIDGET_ID = pmdw.PMD_WIDGET_ID
LEFT JOIN
    opspm.PM_TASK_CATEGORY c ON a.CATEGORY_ID = c.CATEGORY_ID
LEFT JOIN
    opspm.PM_STATUS d ON g.STATUS_ID = d.STATUS_ID
LEFT JOIN
  opspm.PM_FREQUENCY f on a.FREQUENCY_ID= f.FREQUENCY_ID
   LEFT JOIN 
  opsinv.OPS_KEYWORDS inv on inv.KW_NAME=a.SPECIFIC_DATA_NAME
WHERE g.PM_HEADER_ID = :pmHeaderId and g.IS_DISABLED=0`,

    getestById: `
     SELECT 
    COUNT(*) AS NUMTASKS,
    SUM(
        CASE
            WHEN d.status_id != 'I' THEN
                1
            ELSE
                0
        END
    )       AS NUMTASKSDONE 
   
FROM 
     opspm.PM_LOCATION_TASK g
LEFT JOIN 
OPSPM.PM_TASK_LIST_ITEM a ON g.TASK_ID = a.TASK_ID

LEFT JOIN
    opspm.PM_TASK_CATEGORY c ON a.CATEGORY_ID = c.CATEGORY_ID
LEFT JOIN
    opspm.PM_STATUS d ON g.STATUS_ID = d.STATUS_ID
LEFT JOIN
  opspm.PM_FREQUENCY f on a.FREQUENCY_ID= f.FREQUENCY_ID

    WHERE g.PM_HEADER_ID = :pmHeaderId and g.IS_DISABLED=0
    `,
    getTestbyId: `
    SELECT DISTINCT a.STATUS_ID
FROM opspm.PM_TASK_AVAILABLE_STATUS_ITEM a
JOIN OPSPM.PM_LOCATION_TASK b
ON a.TASK_ID = b.TASK_ID
WHERE b.PM_HEADER_ID = :pmHeaderId 
    order by 
  case a.status_ID
  when 'I' then 1
  when 'P' then 2
  when 'F' then 3
  when 'NA' then 4
  ELSE 5
  END `,
};

export const queries = {
    getPmMgrSumm: `
          SELECT techid, sum(numtasks) as  numtasks, sum(numtasksdone) as numtasksdone, duein FROM( 
        SELECT
          lower(st.TECH_ID) AS techid,
          pmd.NUM_OF_TASKS AS numtasks,
          pmd.NUM_OF_TASKS_DONE AS numtasksdone,
          :duein AS duein,
          ROW_NUMBER() OVER (PARTITION by pmd.PM_UNID ORDER BY pmd.CREATED_ON DESC) AS row_num
        FROM 
          PMD_WIDGET_PM_DETAILS pmd
           LEFT JOIN
        opsinv.SITE_DATA_NEW st ON st.META_UNIVERSALID=pmd.SITE_UNID
        WHERE 
          LOWER(st.TECH_ID) in (select lower(login_id) from sec_contact where manager_id = :mgrid)
        AND 
         pmd.END_DATE <= 
            CASE
              WHEN :duein = '30' THEN SYSDATE + 30
              WHEN :duein = '60' THEN SYSDATE + 60
              WHEN :duein = '90' THEN SYSDATE + 90
              WHEN :duein = '180' THEN SYSDATE + 180
              WHEN :duein = 'eoy' THEN TO_DATE('31-DEC-' || TO_CHAR(SYSDATE, 'YYYY')|| '23:59:59', 'DD-MON-YYYY HH24:MI:SS')
            END
            AND TO_CHAR(pmd.END_DATE, 'YYYY') =  TO_CHAR(SYSDATE, 'YYYY')
             ) 
             WHERE row_num = 1 group by techid, duein
            `,
};


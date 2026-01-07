export const queries = {
  getSitePmTemplates: `
    SELECT
    plt.template_name,
    plt.list_template_id,
    plt.template_desc,
    plt.is_disabled,
    pf.frequency_name
    FROM
    opspm.pm_location_template plt_loc
    JOIN opspm.pm_list_template plt ON plt_loc.list_template_id = plt.list_template_id
    JOIN opspm.pm_frequency pf ON plt_loc.frequency_id = pf.frequency_id
    WHERE
    plt_loc.location_type = 'Cell'
    AND plt.is_disabled = 0
    AND sysdate BETWEEN plt.start_date AND plt.stop_date 
    AND ( ( plt_loc.site_unid IS NULL AND plt_loc.switch_unid IS NULL )
    OR plt_loc.site_unid = :siteUnId )`
};

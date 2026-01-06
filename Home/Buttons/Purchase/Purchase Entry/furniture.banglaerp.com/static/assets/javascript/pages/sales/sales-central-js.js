function fnInitialAgentAccountGlobal(branch_code, agent_account_number) {
    const accountSearchUrl = `/apifinance-accounts-search/`;
    initAccountsSelect2WithAjax(branch_code, '', 'SALES_AGENT_ACCOUNT', '', 'N', accountSearchUrl, agent_account_number, '');
}


async function sales_handle_project_batch_list(branch_code, client_id, account_number, batch_status, targetFieldId, selectedValue = null) {

    const choiceUrl = `/sales-batchopen-get`;
    const choiceParams = new URLSearchParams({
        'client_id': client_id,
        'branch_code': branch_code,
        'account_number': account_number,
        'batch_status': batch_status
    });

    await generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'project_batch_id',
        'project_batch_name',
        targetFieldId,
        false,
        selectedValue
    );
}

async function sales_set_product_unitlist(product_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/sales-get-productunitlist`;
    const choiceParams = new URLSearchParams({
        'product_id': product_id
    });

    const resData = await fnBackendCommunicator(choiceParams, "POST", choiceUrl);

    let json_data = resData.data[0].transaction_unit_list;

    if (!selectedValue && json_data.length > 0) {
        selectedValue = resData.data[0].base_unit_id;
    }

    const choiceValue = 'transaction_unit_id';
    const displayValue = 'transaction_unit_name';

    const targetElement = document.getElementById(targetFieldId);
    if (targetElement) {
        targetElement.innerHTML = '';
        json_data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[choiceValue]; // Assign the value from the specified key
            option.textContent = item[displayValue]; // Set the display text

            if (selectedValue !== null && String(item[choiceValue]) === String(selectedValue)) {
                option.selected = true;
            }

            targetElement.appendChild(option);
        });
    }

}

async function sales_handle_warehouse_list(branch_code, targetFieldId, selectedValue = null) {

    const choiceUrl = `/sales-store-get`;
    const choiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'store_id',
        'store_name',
        targetFieldId,
        true,
        selectedValue
    );
}


async function sales_item_type_list(targetFieldId, selectedValue = null) {

    const choiceUrl = `/sales-itemtype-get`;
    const choiceParams = new URLSearchParams({});

    generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'item_type_id',
        'item_type_name',
        targetFieldId,
        true,
        selectedValue
    );
}


async function sales_set_installment_option_list(product_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/sales-products-get-emioption`;
    const choiceParams = new URLSearchParams({
        'product_id': product_id
    });

    generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'inst_option_id',
        'emi_option_name',
        targetFieldId,
        true,
        selectedValue
    );
}
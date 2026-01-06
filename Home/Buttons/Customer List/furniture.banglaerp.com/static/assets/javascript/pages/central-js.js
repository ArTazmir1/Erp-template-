async function generate_country_list_field_empty(targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-country-api/`;
    const choiceParams = new URLSearchParams({});
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'country_id',
        'country_name',
        targetFieldId,
        true,
        selectedValue
    );
}

async function generate_country_list_field(targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-country-api/`;
    const choiceParams = new URLSearchParams({});
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'country_id',
        'country_name',
        targetFieldId,
        false,
        selectedValue
    );
}

async function generate_division_list_field(country_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-division-api/`;
    const choiceParams = new URLSearchParams({
        'country_id': country_id
    });
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'division_id',
        'division_name',
        targetFieldId,
        true,
        selectedValue
    );
}

async function generate_district_list_field(division_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-district-api/`;
    const choiceParams = new URLSearchParams({
        'division_id': division_id
    });
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'district_id',
        'district_name',
        targetFieldId,
        true,
        selectedValue
    );
}

async function generate_upozila_list_field(district_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-upazila-api/`;
    const choiceParams = new URLSearchParams({
        'district_id': district_id
    });
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'upozila_id',
        'upozila_name',
        targetFieldId,
        true,
        selectedValue
    );
}

async function generate_union_list_field(upozila_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-union-api/`;
    const choiceParams = new URLSearchParams({
        'upozila_id': upozila_id
    });
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'union_id',
        'union_name',
        targetFieldId,
        true,
        selectedValue
    );
}


async function generate_village_list_field(union_id, targetFieldId, selectedValue = null) {

    const choiceUrl = `/apiauth-village-api/`;
    const choiceParams = new URLSearchParams({
        'union_id': union_id
    });
    const ChoiceFullUrl = choiceUrl + '?' + choiceParams.toString();

    await generateAndAssignChoiceList(
        ChoiceFullUrl,
        'GET',
        null,
        'village_id',
        'village_name',
        targetFieldId,
        true,
        selectedValue
    );
}
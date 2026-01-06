function makeSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
    await makeSleep(5000); // Sleep for 5 seconds
}

function roundTileQuantity(values) {
    var output_data = (Math.round(values * 100) / 100);
    return output_data;
}


var unit_dictionary = {};
var unit_transaction_dictionary = {};
var lower_unit_dictionary = {};

function fn_make_unit_dictonary() {
    dictionary = {};
    $.ajax({
        url: "/sales-get-unitdictonary",
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                let unit_config = data.data;
                for (var i = 0; i < unit_config.length; i++) {
                    var unitKey = unit_config[i].unit_key;
                    var conversionRatio = unit_config[i].conversion_ratio;
                    unit_dictionary[unitKey] = conversionRatio;

                    if (!(unit_config[i].converted_unit_id in lower_unit_dictionary)) {
                        lower_unit_dictionary[unit_config[i].converted_unit_id] = unit_config[i].base_unit_id;
                    }

                }
            } else {
                console.log(data.error_message);
            }
        }
    })
    return true;
}

function fn_make_unit_transaction_dictonary() {
    dictionary = {};
    $.ajax({
        url: "/sales-transaction-unitlist",
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                let unitData = data.data;
                // Iterate over the JSON data
                unitData.forEach(function(unit) {
                    // Check if base_unit_id exists in the result dictionary
                    if (!(unit.base_unit_id in unit_transaction_dictionary)) {
                        // If not, create an empty dictionary for the base_unit_id
                        unit_transaction_dictionary[unit.base_unit_id] = {};
                    }
                    // Add unit_id and unit_name to the inner dictionary
                    unit_transaction_dictionary[unit.base_unit_id][unit.unit_id] = unit.unit_name;
                });
            } else {
                console.log(data.error_message);
            }
        }
    })
    return true;
}


$(window).on('load', function() {
    fn_make_unit_dictonary();
    fn_make_unit_transaction_dictonary();
});

function fn_get_unit_conversion_rate(transaction_unit_id) {
    var lower_unit = lower_unit_dictionary[transaction_unit_id];
    var unitKey = lower_unit + '-' + transaction_unit_id;
    var convertion_value = Number(unit_dictionary[unitKey]);
    if (convertion_value === undefined) {
        fn_make_unit_dictonary();
        sleep();
        var convertion_value = Number(unit_dictionary[unitKey]);
    }
    if (isNaN(convertion_value)) {
        convertion_value = 1
    }
    return convertion_value;
}

function fnGetActualTilesQuantity(p_capacity_array, p_input_quantity, p_input_unit, p_packet_pcs) {

    if (p_capacity_array != '') {
        var quantity_counter = 0;
        const capacity_array = p_capacity_array.split("X");
        const capacity_first = Number(capacity_array[0].replace(/^\s+|\s+$/gm, ''));
        const capacity_second = Number(capacity_array[1].replace(/^\s+|\s+$/gm, ''));

        var capacity_total = (capacity_first * capacity_second) / 144;
        var base_capacity = (capacity_first * capacity_second) / 144;

        if (p_input_unit == 'SqrFt') {
            while (capacity_total < p_input_quantity) {
                quantity_counter = quantity_counter + 1;
                capacity_total = base_capacity * quantity_counter;
            }
        }

        if (p_input_unit == 'TilesPcs') {
            capacity_total = base_capacity * p_input_quantity;
        }

        if (p_input_unit == 'Box') {
            capacity_total = base_capacity * p_packet_pcs * p_input_quantity;
        }
    } else {
        capacity_total = p_input_quantity;
    }
    return roundTileQuantity(capacity_total);
}

function fnGetAvailableTilesQuantity(p_capacity_array, p_input_sqft, p_input_unit, p_packet_pcs) {
    var available_quantity = p_input_sqft;
    if (p_capacity_array != '') {
        const capacity_array = p_capacity_array.split("X");
        const capacity_first = Number(capacity_array[0].replace(/^\s+|\s+$/gm, ''));
        const capacity_second = Number(capacity_array[1].replace(/^\s+|\s+$/gm, ''));
        var base_capacity = (capacity_first * capacity_second) / 144;

        if (p_input_unit == 'TilesPcs') {
            available_quantity = p_input_sqft / base_capacity;
        }

        if (p_input_unit == 'Box') {
            available_quantity = p_input_sqft / base_capacity / p_packet_pcs;
        }
    }
    return roundTileQuantity(available_quantity);
}

function fnGetTilesUnitQuantity(p_capacity_array, p_unit_id, p_actual_quantity, p_unit_quantity) {
    var w_quantity = 0;
    if (p_capacity_array != '' && p_unit_id == 'SqrFt') {
        w_quantity = p_actual_quantity
    } else {
        w_quantity = p_unit_quantity
    }
    return w_quantity;
}
var query = '%22elblogdehumitos.com.ar/osm/%22'
var url = 'http://api.openstreetmap.org/api/0.6/notes/search.json?q=' + query

function urlFormatter(value, row) {
    return '<a target="_blank" href="' + value + '">' + value + '</a>';
}

function commentFormatter(value, row) {
    value = value.replace('elblogdehumitos.com.ar/osm/ submitted note from a business:\n<br />:', '');
    return value;
}

function rowStyle(row, index) {
    if(row.status == 'closed') return {classes: 'success'};
    if(row.status == 'open') return {classes: 'danger'};
}

if (location.hash) location.hash = '';

$(window).on('hashchange', function() {
    if (location.hash == '#about') {
        $('#about-container').removeClass('hide');
        $('#table-container').addClass('hide');
    } else if (location.hash == '#home') {
        $('#table-container').removeClass('hide');
        $('#about-container').addClass('hide');
    }

    $('li.active').removeClass('active');
    $('li > a[href="' + location.hash + '"]').parent().addClass('active');
});

$(document).ready(function() {
    $.getJSON(url, function(data) {

	// I don't like the way this is implemented, but I couldn't do
	// it just with the plugin bootstrapTable
	var mydata = [];
	$.each(data.features, function(i, item) {
	    mydata.push({
		id: item.properties.id,
		url: 'http://www.openstreetmap.org/note/' + item.properties.id,
		date_created: item.properties.date_created,
		status: item.properties.status,
		comment: item.properties.comments[0].html
	    })
	});

	$('#notes').bootstrapTable({
            method: 'get',
            data: mydata,
            cache: false,
            height: 'auto',
            striped: false,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            search: true,
            showColumns: true,
            showRefresh: true,
            minimumCountColumns: 2,
            clickToSelect: true,
	    rowStyle: rowStyle,
            columns: [
		{
		    field: 'id',
		    title: 'ID',
		    align: 'left',
		    valign: 'middle',
		    sortable: true
		},
		{
		    field: 'date_created',
		    title: 'Date Created',
		    align: 'left',
		    valign: 'middle',
		    sortable: true
		},
		{
		    field: 'status',
		    title: 'Status',
		    align: 'right',
		    valign: 'middle',
		    sortable: true
		},
		{
		    field: 'comment',
		    title: 'Comment',
		    align: 'left',
		    valign: 'middle',
		    formatter: commentFormatter
		},
		{
		    field: 'url',
		    title: 'Note url',
		    align: 'right',
		    valign: 'middle',
		    formatter: urlFormatter
		}]

	});
	
    });
});

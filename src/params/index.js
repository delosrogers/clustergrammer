// var crossfilter = require('crossfilter');
var change_network_view = require('../network/change_network_view');
var parent_div_size = require('../parent_div_size');
var is_force_square = require('./is_force_square');
var get_svg_dim = require('./get_svg_dim');
var set_label_params = require('./set_label_params');
var set_viz_params = require('./set_viz_params');
var ini_matrix_params = require('./ini_matrix_params');
var set_clust_width = require('./set_clust_width');
var calc_default_fs = require('./calc_default_fs');
var set_matrix_params = require('./set_matrix_params');

/* 
Params: calculates the size of all the visualization elements in the
clustergram.
 */

module.exports = function make_params(input_config) {

  var config = $.extend(true, {}, input_config);
  var params = config;

  // when pre-loading the visualization using a view
  if (params.ini_view !== null) {
    params.network_data = change_network_view(params, params.network_data, params.ini_view);
    // disable pre-loading of view 
    params.ini_view = null;
  }

  params = set_label_params(config, params);

  params = set_viz_params(config, params);

  params = ini_matrix_params(config, params);

  var col_nodes = params.network_data.col_nodes;
  var row_nodes = params.network_data.row_nodes;

  // Create wrapper around SVG visualization
  d3.select(config.root).append('div').attr('class', 'viz_wrapper');

  // resize parent div - needs to be run here
  parent_div_size(params);

  params = get_svg_dim(params);

  params.network_data.row_nodes_names = _.pluck(row_nodes, 'name');
  params.network_data.col_nodes_names = _.pluck(col_nodes, 'name');

  params.norm_label.margin = {};
  params.norm_label.margin.left = params.viz.grey_border_width + params.labels.super_label_width;
  params.norm_label.margin.top = params.viz.grey_border_width + params.labels.super_label_width;

  if (params.viz.show_dendrogram){
    // setting config globally 
    config.group_level = {row: 5, col: 5};
  }

  params.norm_label.background = {};

  params.norm_label.background.row = params.norm_label.width.row + 
    params.cat_room.row + params.viz.uni_margin;

  params.norm_label.background.col = params.norm_label.width.col + 
    params.cat_room.col + params.viz.uni_margin;

  params.viz.clust = {};
  params.viz.clust.margin = {};
  params.viz.clust.margin.left = params.norm_label.margin.left + 
    params.norm_label.background.row;

  params.viz.clust.margin.top = params.norm_label.margin.top + 
    params.norm_label.background.col;

  params.colorbar_room = {};
  var tmp_colorbar_room = 0;
  params.colorbar_room.row = tmp_colorbar_room;
  params.colorbar_room.col = tmp_colorbar_room;

  params.viz.num_col_nodes = col_nodes.length;
  params.viz.num_row_nodes = row_nodes.length;

  params.viz.clust.dim = {};

  params = set_clust_width(params);
  params = is_force_square(params);

  if (config.force_square === 1) {
    params.viz.force_square = 1;
  }

  var enr_max = Math.abs(_.max(col_nodes, function (d) {
    return Math.abs(d.value);
  }).value);

  params.labels.bar_scale_col = d3.scale
    .linear()
    .domain([0, enr_max])
    .range([0, 0.75 * params.norm_label.width.col]);

  enr_max = Math.abs(_.max(row_nodes, function (d) {
    return Math.abs(d.value);
  }).value);
  params.labels.bar_scale_row = d3.scale
    .linear()
    .domain([0, enr_max])
    .range([0, params.norm_label.width.row]);

  params = set_matrix_params(config, params);

  params.scale_font_offset = d3.scale
    .linear().domain([1, 0])
    .range([0.8, 0.5]);

  params = calc_default_fs(params);

  params.viz.border_fraction = 55;
  params.viz.border_width = params.matrix.x_scale.rangeBand() /
    params.viz.border_fraction;

  params.matrix.rect_width = params.matrix.x_scale.rangeBand() - 1 * params.viz.border_width;
  params.matrix.rect_height = params.matrix.y_scale.rangeBand() - 1 * params.viz.border_width / params.viz.zoom_switch;


  return params;
};

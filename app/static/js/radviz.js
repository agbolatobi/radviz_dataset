/*
AGBOLA ISEOLUWATOBI B00802526
Assignment 2 
Radviz Data Visualization
References:
    "Distinct colours #2", Jnnnnn.blogspot.com, 2019. Available: https://jnnnnn.blogspot.com/2017/02/distinct-colours-2.html.
    "biovisualize/radviz", GitHub, 2019. Available: https://github.com/biovisualize/radviz.
    "Jan Vorisek’s Blocks - bl.ocks.org", Bl.ocks.org, 2019. Available: https://bl.ocks.org/uicoded.
    "WYanChao/RadViz", GitHub, 2019. Available: https://github.com/WYanChao/RadViz.
*/
window.addEventListener('DOMContentLoaded', (event) => {
    page_loaded();
});

//This Function Sets the variables 
var radviz_circle_size = 400;
var radviz_circle_margin = 120;
var color_dict;
var radviz_default_file = "/data?data_type=iris";
var current_visual_id = "iris"
var default_cluster_keys = {"iris":7,"white":7,"red":7}
var is_cluster = false;
var is_data_assign =  false
$("#no_of_clusters").val(default_cluster_keys["iris"]);


//This Function sets the new file url and removes all the elements before building the new ones 
function selectRadviz(){
    d3.select("#radviz_1_con").selectAll("*").remove();
    d3.select("#radviz_key_color").selectAll("*").remove();
    d3.select("#radviz-opacity-sliders").selectAll("*").remove();
    page_loaded();
}
$("#iris").click(function(){
    current_visual_id = "iris"
    is_data_assign =  false
    $("#iris").addClass("active");
    $("#white_wine").removeClass( "active");
    $("#red_wine").removeClass( "active");
    $("#pre_data").removeClass("active");
    if(is_cluster){
        cluster_no = $("#no_of_clusters").val();
        radviz_default_file = "/cluster?viz_type="+current_visual_id+"&no_of_clusters="+cluster_no;
    }else{
        radviz_default_file = "/data?data_type="+current_visual_id;
    }
    $("#no_of_clusters").val(default_cluster_keys["iris"]);
    selectRadviz()
  });
  $("#white_wine").click(function(){
    current_visual_id = "white"
    is_data_assign =  false
    $("#white_wine").addClass("active");
    $("#red_wine").removeClass( "active");
    $("#iris").removeClass( "active");
    $("#pre_data").removeClass("active");
    $("#no_of_clusters").val(default_cluster_keys["white"]);
    if(is_cluster){
        cluster_no = $("#no_of_clusters").val();
        radviz_default_file = "/cluster?viz_type="+current_visual_id+"&no_of_clusters="+cluster_no;
    }else{
        radviz_default_file = "/data?data_type="+current_visual_id;
    }
    selectRadviz()
  });
  $("#red_wine").click(function(){
    current_visual_id = "red"
    is_data_assign =  false
    $("#red_wine").addClass("active");
    $("#white_wine").removeClass( "active");
    $("#iris").removeClass( "active");
    $("#pre_data").removeClass("active");
    $("#no_of_clusters").val(default_cluster_keys["red"]);
    if(is_cluster){
        cluster_no = $("#no_of_clusters").val();
        radviz_default_file = "/cluster?viz_type="+current_visual_id+"&no_of_clusters="+cluster_no;
    }else{
        radviz_default_file = "/data?data_type="+current_visual_id;
    }
    selectRadviz()
  });
  $("#cluster-switch").click(function(){
    if(is_data_assign){
       alert("no cluster mode for this dataset") 
    }else{
        is_cluster = !is_cluster;
        var cluster_no = $("#no_of_clusters").val();
    
        if(is_cluster){
            radviz_default_file = "/cluster?viz_type="+current_visual_id+"&no_of_clusters="+cluster_no;
            $("#cluster-switch").addClass("btn-danger");
            $("#cluster-switch").removeClass("btn-success");
            $("#cluster-switch").val("Switch to Class");
        }else{
            radviz_default_file = "/data?data_type="+current_visual_id;
            $("#cluster-switch").removeClass("btn-danger");
            $("#cluster-switch").addClass("btn-success");
            $("#cluster-switch").val("Switch to Cluster");
        }
        selectRadviz()
    }
  });

  $("#cluster").click(function(){
    var cluster_no = $("#no_of_clusters").val();
    if(is_cluster){
        radviz_default_file = "/cluster?viz_type="+current_visual_id+"&no_of_clusters="+cluster_no;
        selectRadviz()
    }else{
        alert("Switch to Cluster Mode")
    }
    
  });
  $("#pre_data").click(function(){
    current_visual_id = "a1"
    $("#pre_data").addClass("active");
    $("#white_wine").removeClass( "active");
    $("#iris").removeClass( "active");
    $("#red_wine").removeClass( "active");
    var class_type = $("#current_class").val();
    if(is_cluster){
        alert("cluster mode not avalible for this dataset");
        is_cluster = !is_cluster;
        $("#cluster-switch").removeClass("btn-danger");
        $("#cluster-switch").addClass("btn-success");
        $("#cluster-switch").val("Switch to Cluster");
    }
    is_data_assign = true;
    radviz_default_file = "/data_a1?class="+class_type;
    selectRadviz()
  });

  $("#reload").click(function(){
      if(is_data_assign){
        $("#pre_data").click();
      }else{
          alert("Select Preprocessed Dataset")
      }
  })

//This function loads when a page loads 
function page_loaded(){
    d3.csv(radviz_default_file).then(function(data) {
        draw_radviz(data,radviz_circle_size)
      });

//This Function Draws the the radviz visualization
function draw_radviz(data,size){
    var attributes =data.columns;
    var skip = attributes.pop();
    var circle_stroke_width = 2
    var circle_position = (size/2);
    var circle_margin = radviz_circle_margin;
    var circle_padding = 280;
    var column_position = get_axis_positions(data,circle_position);
    var circle_points;

    //This Function gets the min and max values from each column of data
     function get_min_max(){
         var result = []
        var data_max_min = [];
        var columns = Object.keys(data[0]);
        columns.pop();
        for(column of columns){
           data_max_min[column] = []
        }
        for(data_column of data){
            for(column of columns){
               data_max_min[column].push(parseFloat(data_column[column]));
            }
        }
        for(column of columns){
            var max = Math.max(...data_max_min[column]);
            var min = Math.min(...data_max_min[column]);
            result[column] = {min:min,max:max};
         }
         return result;
     }

     //This Function creates color dictionary 
     function get_color_dict(data){
        var columns = Object.keys(data[0]);
        var unique_classes = []
         for(row of data){
            unique_classes[row[skip]]="";
         }

         //List From https://jnnnnn.blogspot.com/2017/02/distinct-colours-2.html
         var color_list = ["#525c72", "#21ce03", "#fe3302", "#fa46ff", "#876d0d", "#a24568", "#159bfc", "#14926d", "#9149f8", "#fd5a93", "#85706a", "#ad4d1e", "#4a8b00", "#a96bb1", "#04859b", "#4d6643", "#e2770f", "#4567c6", "#d517a9", "#76527b", "#c310f3", "#d5324b", "#7c78a9", "#657b79", "#7d80fd", "#949401", "#b46965", "#017065", "#6f864d", "#805432", "#12ad4b", "#b86dfd", "#b0743b", "#c66495", "#eb6555", "#5c5c59", "#0e7b3a", "#7b5057", "#5785b7", "#a14297", "#986782", "#884eaf", "#ff3fc6", "#296b97", "#5e700c", "#e6147f", "#635b98", "#746b7b", "#6fa914", "#756c44", "#af830a", "#d85311", "#d25ac2", "#994d45", "#62768b", "#476263", "#7369ce", "#ff3d60", "#985b0b", "#2e7cfe", "#13938d", "#966ec9", "#d85d73", "#537f60", "#45934d", "#fe6001", "#166d7a", "#886996", "#c55345", "#cd5aeb", "#db07dc", "#9a674c", "#c1387f", "#719433", "#cd6c42", "#666f60", "#586d9d", "#067bca", "#bb6005", "#675665", "#aa4cbe", "#2b6f4d", "#5e66fb", "#a341e1", "#927941", "#1295ca", "#996efb", "#675942", "#b24250", "#dd3a2a", "#894b70", "#7c8011", "#407d7e", "#946064", "#df4aa2", "#7182cd", "#635879", "#60642a", "#4e763b", "#21b10b", "#a85587", "#b65c74", "#7a5d20", "#606971"]
         var range = color_list.length - unique_classes.length;
         var starting_index = Math.round((Math.random() * range));
         for(key in unique_classes){
            unique_classes[key] = color_list[starting_index];
            starting_index += 1
        }
        
        return unique_classes;
     }

     var min_max_dict = get_min_max();

     //This Function is used to normalize the all the data
     function normalize_data(data){
         for(d of data){
             var sum = 0
             var print_value = "";
             for(col in min_max_dict){
                print_value = print_value + col+": "+d[col]+"</br>";
                d[col+"_normalized"]= normalize_value(d[col],min_max_dict[col].min,min_max_dict[col].max);
                sum +=d[col+"_normalized"]
             }
             print_value = print_value + skip+": "+d[skip]+"</br>";
             d["print_value"] = print_value;
             d["normalized_sum"] = sum;  
         }
     }

     //Gets the positions of all the points 
     function get_points_positions(data){
        for(d of data){
            var dx = 0;
            var dy = 0;
            for(col of column_position){
                if(col != skip){
                    dx += Math.cos(col["degrees"])*d[col["anchor_name"]+"_normalized"]; 
					dy += Math.sin(col["degrees"])*d[col["anchor_name"]+"_normalized"];
                }
            }
            d["x_t"] = dx/d["normalized_sum"];
            d["y_t"] = dy/d["normalized_sum"];
            d["dist"] 	= Math.sqrt(Math.pow(dx/d["normalized_sum"], 2) + Math.pow(dy/d["normalized_sum"], 2));
            d["distH"] = Math.sqrt(Math.pow(dx/d["normalized_sum"], 2) + Math.pow(dy/d["normalized_sum"], 2));
            d["theta"] = Math.atan2(dy/d["normalized_sum"], dx/d["normalized_sum"]) * 180 / Math.PI; 
        }
     }

     //This variables draw the d3 layout and elements 
    var svgContainer = d3.select("#radviz_1_con").append("svg")
                                        .attr("width",size + (circle_stroke_width  * 2) + circle_padding)
                                        .attr("height",size + (circle_stroke_width  * 2) + circle_padding);
    var divKeyContainer = d3.select("#radviz_key_color");
    var divSliderContainer = d3.select("#radviz-opacity-sliders");
    var div = d3.select("body").append("div")	
                                        .attr("class", "tooltip")				
                                        .style("opacity", 0);
    var first_group = svgContainer.append("g")
                            .attr("cx", circle_margin)
                            .attr("cy", circle_margin);
    var circle = first_group.append("circle")
                             .attr("cx", circle_position+circle_margin)
                             .attr("cy", circle_position+circle_margin)
                            .attr("r", circle_position)
                            .style("fill", "white")
                            .attr("stroke-width", circle_stroke_width)
                            .attr("stroke", "black");
        var anchor_points = first_group.selectAll("radviz_anchor_points")
                                        .data(column_position)
                                        .enter()
                                        .append("circle")
                                        .attr('fill', d3.rgb(120,120,120))
                                        .attr('stroke',"#000000")
                                        .attr('stroke-width', 2)
                                        .attr('r', 5)
                                        .attr('cx', function(d) { return d.x+circle_margin; })
                                        .attr('cy',function(d) { return d.y+circle_margin;})
                                        .call(d3.drag().on("drag", dragged));
                                        add_radviz_anchor_text(circle_margin);
                                        draw_points_in_radviz(data)
        
        //This Function generates the keys for the star coordinate points 
        function set_key(){
            var start_point = {x:10,y:10};
            var key_pair = divKeyContainer.append("g");
            var length = 0
            for(key in color_dict){
                length = length + 1;
            }
            var svg = key_pair.append("svg")
                                .attr("width",350)
                                .attr("height",length*40);
            for(key in color_dict){
                svg.append("circle")
                    .text(key)
                    .attr('fill', color_dict[key])
                    .attr('stroke',"#000000")
                    .attr('stroke-width', 2)
                    .attr('r', 5)
                    .attr('cx',start_point.x)
                    .attr('cy',start_point.y)
                    .attr("id",key+"")
                    .on("mouseover", function(d) {	
                        d3.selectAll("#circles"+d3.select(this).attr('id'))
                            .attr('r',5)
                            .attr('stroke-width',1);
                    })
                    .on("mouseout", function(d) {	
                        d3.selectAll("#circles"+d3.select(this).attr('id'))
                            .attr('r',3)
                            .attr('stroke-width',1);
                    })
                    if(is_cluster){
                        svg.append("text")
                        .text("Cluster "+(parseInt(key)+1)+" ")
                        .attr('font-size', '12pt')
                        .attr('x',start_point.x+30)
                        .attr('y',start_point.y+5);
                    }else{
                        svg.append("text")
                        .text(key+" ")
                        .attr('font-size', '12pt')
                        .attr('x',start_point.x+30)
                        .attr('y',start_point.y+5);
                    }

                divSliderContainer.append("input")
                .attr("type","range")
                .attr("value",100)
                .style("display","block")
                .style("margin-bottom","10px")
                .attr("id",key+"")
                .on('change', function() {
                    var newData = eval(d3.select(this).property('value'));
                                d3.selectAll("#circles"+d3.select(this).attr('id'))
                                .transition()
                                .duration(1000)
                                .ease(d3.easeLinear)
                                .style("opacity", (1-(100-newData)/100));
                });
                start_point.y = start_point.y + 30;
                
            }
        }

        //This Function generates the small circles in radviz
        function draw_small_circles(color_dict){
            circle_points = first_group.selectAll("radviz_circle_points")
                .data(data)
                .enter()
                .append("circle")
                .attr('r',3)
                .attr('cx',function(d) { return d['x_t']*circle_position+circle_position+circle_margin; })
                .attr('cy',function(d) { return d['y_t']*circle_position+circle_position+circle_margin; })
                .attr('class',"circle_points")
                .attr('fill', function(d) { return color_dict[d[skip]]; })
                .attr('stroke', "#000000")
                .attr('stroke-width', 1)
                .attr('class', "radviz_circle_points")
                .attr('id',function(d) { var id = "circles"+d[skip]; return id;})
                .on("mouseover", function(d) {
                    d3.select(this).attr('r',6);
                    d3.select(this).attr('stroke-width',2)
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    if(!is_data_assign){	
                        // div	.html(d["print_value"])	
                        if(is_cluster){
                            div.html("<img src='/corelation_matrix?viz_type=cluster&class_type="+d[skip]+"' alt='cluster' style='width:90%; height:auto;' />")	
                            .style("left", (d3.event.pageX) + "px")		
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("height","auto")
                            .style("width","auto");	
                        }else{
                            div.html("<img src='/corelation_matrix?viz_type="+current_visual_id+"&class_type="+d[skip]+"' alt='"+current_visual_id+"' style='width:90%; height:auto;' />")	
                            .style("left", (d3.event.pageX) + "px")		
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("height","auto")
                            .style("width","auto");	
                        }
                    }
                    })					
                .on("mouseout", function(d) {	
                    d3.select(this).attr('r',3);
                    d3.select(this).attr('stroke-width',1)	
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
        }

        //This function draws the radviz visualization
        function draw_points_in_radviz(data){
            normalize_data(data)
            get_points_positions(data)
            color_dict = get_color_dict(data)
            var test = first_group.selectAll(".circle_points").remove();
            draw_small_circles(color_dict);
            set_key();     
        }

        //This function sets the anchors text
        function add_radviz_anchor_text(margin){
            var radviz_anchor = first_group.selectAll("anchor_text")
                                            .data(column_position)
                                            .enter()
                                            .append("text")
                                            .attr('x', function(d) { return d.x+circle_margin; })
                                            .attr('y',function(d) {  return d.y+circle_margin;})
                                            .text(function(d) { return d.anchor_name; })
                                            .attr('text-anchor', d=>Math.cos(d.degrees)>0?'start':'end')
                                            .attr('dominat-baseline', d=>Math.sin(d.degrees)<0?'baseline':'hanging')
                                            .attr('dx', d => Math.cos(d.degrees) * 15)
                                            .attr('dy', d=>Math.sin(d.degrees)<0?Math.sin(d.degrees)*(15):Math.sin(d.degrees)*(15)+ 10)
                                            .attr('font-size', '10pt')
                                            .attr('id',function(d) { var anchor_name = d.anchor_name;  return anchor_name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g,''); });
        }

        //This Function moves the anchors text
        function edit_radviz_anchor_text(anchor_name,degrees,x,y){
            var radviz_anchor = first_group.append("text")
                                            .attr('x', x+9)
                                            .attr('y',y+9)
                                            .text(anchor_name)
                                            .attr('text-anchor', Math.cos(degrees)>0?'start':'end')
                                            .attr('dominat-baseline', Math.sin(degrees)<0?'baseline':'hanging')
                                            .attr('dx', Math.cos(degrees) * 15)
                                            .attr('dy', Math.sin(degrees)<0?Math.sin(degrees)*(15):Math.sin(degrees)*(15)+ 10)
                                            .attr('font-size', '10pt')
                                            .attr('id', anchor_name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g,'') );
        }

        //This function generates the animations for the drags functionality 
        function dragged(d){
            radius = radviz_circle_size/2;
            var temp_x = d3.event.x - radius;
            var temp_y = d3.event.y - radius;
            var  current_degree = Math.atan2(temp_y,temp_x);
            current_degree = current_degree<0? 2*Math.PI + current_degree : current_degree;
            var x_axis = radius * Math.cos(current_degree) + radius + radviz_circle_margin;
            var y_axis = radius * Math.sin(current_degree) + radius + radviz_circle_margin;
            d.x = x_axis, d.y = y_axis;
            d3.select(this).attr("cx", x_axis).attr("cy", y_axis);
            var anchor_name = d.anchor_name;
            d3.selectAll("g").select("#"+anchor_name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g,'')).remove();
            edit_radviz_anchor_text(anchor_name,current_degree,x_axis,y_axis);
            d3.selectAll("g").selectAll(".radviz_circle_points").remove();
            for(col of column_position){
                if(col["anchor_name"] == d.anchor_name){
                    col["degrees"] = current_degree; 
                }
            }
            divSliderContainer.selectAll()
                              .attr("value",100);
            get_points_positions(data)
            draw_small_circles(color_dict)
            
        }

        //The Function normalizes the values
        function normalize_value(n_data,min,max){
            return (n_data - min)/(max-min);
        }
} 

//This Function gets the gets the positions of the axis 
function get_axis_positions(data,radius){
    var result = []
    let columns = Object.keys(data[0]);
    last_column = columns.pop();
    degrees_between = 2*(Math.PI)/columns.length;
    current_degree = 0
    for(column in columns){
        var x_axis = radius * Math.cos(current_degree) + radius;
        var y_axis = radius * Math.sin(current_degree) + radius;
        result.push({anchor_name:columns[column],x:x_axis,y:y_axis,degrees:current_degree})
        current_degree = current_degree + degrees_between;
    }
    return result;
}

}

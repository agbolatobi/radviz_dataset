#references 
# from https://stackoverflow.com/questions/50728328/python-how-to-show-matplotlib-in-flask
from app import app
from flask import request
from flask import jsonify
from app.data_processor import data_processor
from flask import render_template
from flask import Response

data_store = data_processor()
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/data', methods=['GET'])
def get_followers():
    data = request.args.get('data_type')
    if data == "iris":
        result = data_store.iris_string
    elif data == "red":
        result = data_store.red_string
    elif data == "white":
        result = data_store.white_string
    else:
        result = {}
        result["status"] = "Error"
    return result

@app.route('/corelation_matrix', methods=['GET'])
def get_corelation_img():
    viz_type = request.args.get('viz_type')
    class_type = request.args.get('class_type')
    if viz_type == "iris":
        return Response(data_store.iris_matrix[class_type], mimetype='image/png')
    elif viz_type == "red":
        class_type = int(class_type)
        return Response(data_store.red_matrix[class_type], mimetype='image/png')
    elif viz_type == "white":
        class_type = int(class_type)
        return Response(data_store.white_matrix[class_type], mimetype='image/png')
    elif viz_type == "cluster":
        class_type = int(class_type)
        return Response(data_store.cluster_corr[class_type], mimetype='image/png')

@app.route('/unique_class', methods=['GET'])
def get_unique_class():
    viz_type = request.args.get('viz_type')
    if viz_type == "iris":
        return jsonify(data_store.iris_classes)
    elif viz_type == "red":
        return jsonify(data_store.red_classes)
    elif viz_type == "white":
        return jsonify(data_store.white_classes)
    
@app.route('/cluster',methods=['GET'])
def get_cluster():
    viz_type = request.args.get('viz_type')
    no_of_clusters = request.args.get('no_of_clusters')
    return data_store.return_clustered_dataset(viz_type,no_of_clusters)

@app.route('/data_a1', methods=['GET'])
def get_assign_data():
    class_col = request.args.get('class')
    result = data_store.create_data_col(class_col)
    return result
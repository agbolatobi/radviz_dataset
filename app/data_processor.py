import numpy as np
import pandas as pd
import os
import io
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from flask import Response
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

class data_processor():
    iris_name = os.getcwd()+"/app/data/iris.csv"
    red_name = os.getcwd()+"/app/data/winequality-red.csv"
    white_name = os.getcwd()+"/app/data/winequality-white.csv"
    cluster_corr = {}
    iris_file = open(iris_name,"r")
    iris_string = contents =iris_file.read()
    white_file = open(white_name,"r")
    white_string = contents =white_file.read()
    red_file = open(red_name,"r")
    red_string = contents =red_file.read()
    iris = pd.read_csv(iris_name)
    def plot_correlation_matrix(data_frame): 
        f = plt.figure(figsize=(19, 15))
        plt.matshow(data_frame.corr(), fignum=f.number)
        plt.xticks(range(data_frame.shape[1]), data_frame.columns, fontsize=14, rotation=45)
        plt.yticks(range(data_frame.shape[1]), data_frame.columns, fontsize=14)
        cb = plt.colorbar()
        cb.ax.tick_params(labelsize=14)
        plt.title('Correlation Matrix', fontsize=16);
        return f
    iris_classes = {}
    iris_classes["class"] = list(iris["Class"].unique())
    iris_matrix = {}
    for d in iris["Class"].unique():
        col_iris = iris.loc[iris["Class"]==d]
        col_iris = col_iris.reset_index(drop=True)
        col_iris = col_iris.iloc[:, 0:4]
        output = io.BytesIO()
        FigureCanvas(plot_correlation_matrix(col_iris)).print_png(output)
        iris_matrix[d] = output.getvalue()
    red = pd.read_csv(red_name) 
    red_classes = {"class":[]} 
    for d in list(red["quality"].unique()):
        red_classes["class"].append(int(d))
    red_matrix = {}
    for d in red["quality"].unique():
        col_red = red.loc[red["quality"]==d]
        col_red = col_red.reset_index(drop=True)
        col_red = col_red.iloc[:, 0:11]
        output = io.BytesIO()
        FigureCanvas(plot_correlation_matrix(col_red)).print_png(output)
        red_matrix[d] = output.getvalue()
    
    white = pd.read_csv(white_name)
    white_classes = {"class":[]} 
    for d in list(white["quality"].unique()):
        white_classes["class"].append(int(d))
    white_matrix = {}
    for d in white["quality"].unique():
        col_white = white.loc[white["quality"]==d]
        col_white = col_white.reset_index(drop=True)
        col_white = col_white.iloc[:, 0:11]
        output = io.BytesIO()
        FigureCanvas(plot_correlation_matrix(col_white)).print_png(output)
        white_matrix[d] = output.getvalue()
        
    def return_clustered_corr(self):
        cluster_name = os.getcwd()+"/app/data/cluster.csv"
        cluster = pd.read_csv(cluster_name)
        cluster_classes = {"class":[]} 
        def plot_correlation_matrix(data_frame): 
            f = plt.figure(figsize=(19, 15))
            plt.matshow(data_frame.corr(), fignum=f.number)
            plt.xticks(range(data_frame.shape[1]), data_frame.columns, fontsize=14, rotation=45)
            plt.yticks(range(data_frame.shape[1]), data_frame.columns, fontsize=14)
            cb = plt.colorbar()
            cb.ax.tick_params(labelsize=14)
            plt.title('Correlation Matrix', fontsize=16);
            return f
        for d in list(cluster[cluster.columns[-1]].unique()):
            cluster_classes["class"].append(d)
        cluster_matrix = {}
        for d in cluster[cluster.columns[-1]].unique():
            col_cluster = cluster.loc[cluster[cluster.columns[-1]]==d]
            col_cluster = col_cluster.reset_index(drop=True)
            col_cluster = col_cluster.loc[:, col_cluster.columns != cluster.columns[-1]]
            output = io.BytesIO()
            FigureCanvas(plot_correlation_matrix(col_cluster)).print_png(output)
            cluster_matrix[d] = output.getvalue()
        return cluster_matrix
    
    def return_clustered_dataset(self,cluster_type,no_of_clusters):
        iris_name = os.getcwd()+"/app/data/iris.csv"
        red_name = os.getcwd()+"/app/data/winequality-red.csv"
        white_name = os.getcwd()+"/app/data/winequality-white.csv"
        output = os.getcwd()+"/app/data/cluster.csv"
        iris = pd.read_csv(iris_name)
        white = pd.read_csv(white_name)
        red = pd.read_csv(red_name)
        def cluster_values(features,cluster_type,no_of_clusters):
            cluster_keys = {"iris":7,"white":7,"red":7}
            kmeans = KMeans(n_clusters=int(no_of_clusters), random_state=111)
            kmeans.fit(features)
            return kmeans.labels_
        if cluster_type == "iris":
           label = cluster_values(iris.iloc[:,0:4],cluster_type,no_of_clusters)
           iris["Class"] = label
           iris.to_csv(output,index=False)
        elif cluster_type == "red":
            label = cluster_values(red.iloc[:,0:11],cluster_type,no_of_clusters)
            red["quality"] = label
            red.to_csv(output,index=False)
        elif cluster_type == "white":
            label = cluster_values(white.iloc[:,0:11],cluster_type,no_of_clusters)
            white["quality"] = label
            white.to_csv(output,index=False)
        output_file = open(output,"r")
        self.cluster_corr = self.return_clustered_corr()
        return output_file.read()
    
    def create_data_col(self,category):
        numerical_column = ["age","fnlwgt","education-num","capital-loss","hours-per-week"]
        output = os.getcwd()+"/app/data/data.csv"
        input_file = os.getcwd()+"/app/data/dataset1_processed.csv"
        a1 = pd.read_csv(input_file)
        data_a1 = pd.DataFrame()
        for d in numerical_column:
            data_a1[d] = a1[d]
        data_a1[category] = a1[category]
        data_a1.to_csv(output,index=False)
        output_file = open(output,"r")
        return output_file.read()
        

        
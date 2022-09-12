\name{Heatmap}
\alias{Heatmap}
\title{
Constructor method for Heatmap class
}
\description{
Constructor method for Heatmap class
}
\usage{
Heatmap(matrix, col, name,
    na_col = "grey",
    color_space = "LAB",
    rect_gp = gpar(col = NA),
    cell_fun = NULL,
    row_title = character(0),
    row_title_side = c("left", "right"),
    row_title_gp = gpar(fontsize = 14),
    row_title_rot = switch(row_title_side[1], "left" = 90, "right" = 270),
    column_title = character(0),
    column_title_side = c("top", "bottom"),
    column_title_gp = gpar(fontsize = 14),
    column_title_rot = 0,
    cluster_rows = TRUE,
    clustering_distance_rows = "euclidean",
    clustering_method_rows = "complete",
    row_dend_side = c("left", "right"),
    row_dend_width = unit(10, "mm"),
    show_row_dend = TRUE,
    row_dend_reorder = TRUE,
    row_dend_gp = gpar(),
    row_hclust_side = row_dend_side,
    row_hclust_width = row_dend_width,
    show_row_hclust = show_row_dend,
    row_hclust_reorder = row_dend_reorder,
    row_hclust_gp = row_dend_gp,
    cluster_columns = TRUE,
    clustering_distance_columns = "euclidean",
    clustering_method_columns = "complete",
    column_dend_side = c("top", "bottom"),
    column_dend_height = unit(10, "mm"),
    show_column_dend = TRUE,
    column_dend_gp = gpar(),
    column_dend_reorder = TRUE,
    column_hclust_side = column_dend_side,
    column_hclust_height = column_dend_height,
    show_column_hclust = show_column_dend,
    column_hclust_gp = column_dend_gp,
    column_hclust_reorder = column_dend_reorder,
    row_order = NULL,
    column_order = NULL,
    row_names_side = c("right", "left"),
    show_row_names = TRUE,
    row_names_max_width = default_row_names_max_width(),
    row_names_gp = gpar(fontsize = 12),
    column_names_side = c("bottom", "top"),
    show_column_names = TRUE,
    column_names_max_height = default_column_names_max_height(),
    column_names_gp = gpar(fontsize = 12),
    top_annotation = new("HeatmapAnnotation"),
    top_annotation_height = top_annotation@size,
    bottom_annotation = new("HeatmapAnnotation"),
    bottom_annotation_height = bottom_annotation@size,
    km = 1,
    km_title = "cluster\%i",
    split = NULL,
    gap = unit(1, "mm"),
    combined_name_fun = function(x) paste(x, collapse = "/"),
    width = NULL,
    show_heatmap_legend = TRUE,
    heatmap_legend_param = list(title = name),
    use_raster = FALSE,
    raster_device = c("png", "jpeg", "tiff", "CairoPNG", "CairoJPEG", "CairoTIFF"),
    raster_quality = 2,
    raster_device_param = list())
}
\arguments{

  \item{matrix}{a matrix. Either numeric or character. If it is a simple vector, it will be converted to a one-column matrix.}
  \item{col}{a vector of colors if the color mapping is discrete or a color mapping  function if the matrix is continuous numbers (should be generated by \code{\link[circlize]{colorRamp2}}. If the matrix is continuous, the value can also be a vector of colors so that colors will be interpolated. Pass to \code{\link{ColorMapping}}.}
  \item{name}{name of the heatmap. The name is used as the title of the heatmap legend.}
  \item{na_col}{color for \code{NA} values.}
  \item{rect_gp}{graphic parameters for drawing rectangles (for heatmap body).}
  \item{color_space}{the color space in which colors are interpolated. Only used if \code{matrix} is numeric and  \code{col} is a vector of colors. Pass to \code{\link[circlize]{colorRamp2}}.}
  \item{cell_fun}{self-defined function to add graphics on each cell. Seven parameters will be passed into  this function: \code{i}, \code{j}, \code{x}, \code{y}, \code{width}, \code{height}, \code{fill} which are row index, column index in \code{matrix}, coordinate of the middle points in the heatmap body viewport, the width and height of the cell and the filled color. \code{x}, \code{y}, \code{width} and \code{height} are all \code{\link[grid]{unit}} objects.}
  \item{row_title}{title on row.}
  \item{row_title_side}{will the title be put on the left or right of the heatmap?}
  \item{row_title_gp}{graphic parameters for drawing text.}
  \item{row_title_rot}{rotation of row titles. Only 0, 90, 270 are allowed to set.}
  \item{column_title}{title on column.}
  \item{column_title_side}{will the title be put on the top or bottom of the heatmap?}
  \item{column_title_gp}{graphic parameters for drawing text.}
  \item{column_title_rot}{rotation of column titles. Only 0, 90, 270 are allowed to set.}
  \item{cluster_rows}{If the value is a logical, it means whether make cluster on rows. The value can also be a \code{\link[stats]{hclust}} or a \code{\link[stats]{dendrogram}} that already contains clustering information. This means you can use any type of clustering methods and render the \code{\link[stats]{dendrogram}} object with self-defined graphic settings.}
  \item{clustering_distance_rows}{it can be a pre-defined character which is in  ("euclidean", "maximum", "manhattan", "canberra", "binary",  "minkowski", "pearson", "spearman", "kendall"). It can also be a function. If the function has one argument, the input argument should be a matrix and  the returned value should be a \code{\link[stats]{dist}} object. If the function has two arguments, the input arguments are two vectors and the function calculates distance between these two vectors.}
  \item{clustering_method_rows}{method to make cluster, pass to \code{\link[stats]{hclust}}.}
  \item{row_dend_side}{should the row cluster be put on the left or right of the heatmap?}
  \item{row_dend_width}{width of the row cluster, should be a \code{\link[grid]{unit}} object.}
  \item{show_row_dend}{whether show row clusters. }
  \item{row_dend_gp}{graphics parameters for drawing lines. If users already provide a \code{\link[stats]{dendrogram}} object with edges rendered, this argument will be ignored.}
  \item{row_dend_reorder}{apply reordering on rows. The value can be a logical value or a vector which contains weight  which is used to reorder rows}
  \item{row_hclust_side}{deprecated, use \code{row_dend_side} instead}
  \item{row_hclust_width}{deprecated, use \code{row_dend_width} instead}
  \item{show_row_hclust}{deprecated, use \code{show_row_dend} instead}
  \item{row_hclust_gp}{deprecated, use \code{row_dend_gp} instead}
  \item{row_hclust_reorder}{deprecated, use \code{row_dend_reorder} instead}
  \item{cluster_columns}{whether make cluster on columns. Same settings as \code{cluster_rows}.}
  \item{clustering_distance_columns}{same setting as \code{clustering_distance_rows}.}
  \item{clustering_method_columns}{method to make cluster, pass to \code{\link[stats]{hclust}}.}
  \item{column_dend_side}{should the column cluster be put on the top or bottom of the heatmap?}
  \item{column_dend_height}{height of the column cluster, should be a \code{\link[grid]{unit}} object.}
  \item{show_column_dend}{whether show column clusters.}
  \item{column_dend_gp}{graphic parameters for drawling lines. Same settings as \code{row_dend_gp}.}
  \item{column_dend_reorder}{apply reordering on columns. The value can be a logical value or a vector which contains weight  which is used to reorder columns}
  \item{column_hclust_side}{deprecated, use \code{column_dend_side} instead}
  \item{column_hclust_height}{deprecated, use \code{column_dend_height} instead}
  \item{show_column_hclust}{deprecated, use \code{show_column_dend} instead}
  \item{column_hclust_gp}{deprecated, use \code{column_dend_gp} instead}
  \item{column_hclust_reorder}{deprecated, use \code{column_dend_reorder} instead}
  \item{row_order}{order of rows. It makes it easy to adjust row order for a list of heatmaps if this heatmap  is selected as the main heatmap. Manually setting row order should turn off clustering}
  \item{column_order}{order of column. It makes it easy to adjust column order for both matrix and column annotations.}
  \item{row_names_side}{should the row names be put on the left or right of the heatmap?}
  \item{show_row_names}{whether show row names.}
  \item{row_names_max_width}{maximum width of row names viewport. Because some times row names can be very long, it is not reasonable to show them all.}
  \item{row_names_gp}{graphic parameters for drawing text.}
  \item{column_names_side}{should the column names be put on the top or bottom of the heatmap?}
  \item{column_names_max_height}{maximum height of column names viewport.}
  \item{show_column_names}{whether show column names.}
  \item{column_names_gp}{graphic parameters for drawing text.}
  \item{top_annotation}{a \code{\link{HeatmapAnnotation}} object which contains a list of annotations.}
  \item{top_annotation_height}{total height of the column annotations on the top.}
  \item{bottom_annotation}{a \code{\link{HeatmapAnnotation}} object.}
  \item{bottom_annotation_height}{total height of the column annotations on the bottom.}
  \item{km}{do k-means clustering on rows. If the value is larger than 1, the heatmap will be split by rows according to the k-means clustering. For each row-clusters, hierarchical clustering is still applied with parameters above.}
  \item{km_title}{row title for each cluster when \code{km} is set. It must a text with format of ".*\%i.*" where "\%i" is replaced by the index of the cluster.}
  \item{split}{a vector or a data frame by which the rows are split. But if \code{cluster_rows} is a clustering object, \code{split} can be a single number indicating rows are to be split according to the split on the tree.}
  \item{gap}{gap between row-slices if the heatmap is split by rows, should be \code{\link[grid]{unit}} object. If it is a vector, the order corresponds to top to bottom in the heatmap}
  \item{combined_name_fun}{if the heatmap is split by rows, how to make a combined row title for each slice? The input parameter for this function is a vector which contains level names under each column in \code{split}.}
  \item{width}{the width of the single heatmap, should be a fixed \code{\link[grid]{unit}} object. It is used for the layout when the heatmap is appended to a list of heatmaps.}
  \item{show_heatmap_legend}{whether show heatmap legend?}
  \item{heatmap_legend_param}{a list contains parameters for the heatmap legend. See \code{\link{color_mapping_legend,ColorMapping-method}} for all available parameters.}
  \item{use_raster}{whether render the heatmap body as a raster image. It helps to reduce file size when the matrix is huge. Note if \code{cell_fun} is set, \code{use_raster} is enforced to be \code{FALSE}.}
  \item{raster_device}{graphic device which is used to generate the raster image}
  \item{raster_quality}{a value set to larger than 1 will improve the quality of the raster image.}
  \item{raster_device_param}{a list of further parameters for the selected graphic device}

}
\details{
The initialization function only applies parameter checking and fill values to each slot with proper ones.
Then it will be ready for clustering and layout.

Following methods can be applied on the \code{\link{Heatmap-class}} object:

\itemize{
  \item \code{\link{show,Heatmap-method}}: draw a single heatmap with default parameters
  \item \code{\link{draw,Heatmap-method}}: draw a single heatmap.
  \item \code{\link{add_heatmap,Heatmap-method}} append heatmaps and row annotations to a list of heatmaps.
}

The constructor function pretends to be a high-level graphic function because the \code{show} method
of the \code{\link{Heatmap-class}} object actually plots the graphics.
}
\value{
A \code{\link{Heatmap-class}} object.
}
\author{
Zuguang Gu <z.gu@dkfz.de>
}
\examples{
mat = matrix(rnorm(80, 2), 8, 10)
mat = rbind(mat, matrix(rnorm(40, -2), 4, 10))
rownames(mat) = letters[1:12]
colnames(mat) = letters[1:10]

require(circlize)

Heatmap(mat)
Heatmap(mat, col = colorRamp2(c(-3, 0, 3), c("green", "white", "red")))
Heatmap(mat, name = "test")
Heatmap(mat, column_title = "blablabla")
Heatmap(mat, row_title = "blablabla")
Heatmap(mat, column_title = "blablabla", column_title_side = "bottom")
Heatmap(mat, column_title = "blablabla", column_title_gp = gpar(fontsize = 20, 
    fontface = "bold"))
Heatmap(mat, cluster_rows = FALSE)
Heatmap(mat, clustering_distance_rows = "pearson")
Heatmap(mat, clustering_distance_rows = function(x) dist(x))
Heatmap(mat, clustering_distance_rows = function(x, y) 1 - cor(x, y))
Heatmap(mat, clustering_method_rows = "single")
Heatmap(mat, row_dend_side = "right")
Heatmap(mat, row_dend_width = unit(1, "cm"))
Heatmap(mat, row_names_side = "left", row_dend_side = "right", 
    column_names_side = "top", column_dend_side = "bottom")
Heatmap(mat, show_row_names = FALSE)

mat2 = mat
rownames(mat2) = NULL
colnames(mat2) = NULL
Heatmap(mat2)

Heatmap(mat, row_names_gp = gpar(fontsize = 20))
Heatmap(mat, km = 2)
Heatmap(mat, split = rep(c("A", "B"), 6))
Heatmap(mat, split = data.frame(rep(c("A", "B"), 6), rep(c("C", "D"), each = 6)))
Heatmap(mat, split = data.frame(rep(c("A", "B"), 6), rep(c("C", "D"), each = 6)), 
    combined_name_fun = function(x) paste(x, collapse = "\n"))

annotation = HeatmapAnnotation(df = data.frame(type = c(rep("A", 6), rep("B", 6))))
Heatmap(mat, top_annotation = annotation)

annotation = HeatmapAnnotation(df = data.frame(type1 = rep(c("A", "B"), 6), 
    type2 = rep(c("C", "D"), each = 6)))
Heatmap(mat, bottom_annotation = annotation)

annotation = data.frame(value = rnorm(10))
annotation = HeatmapAnnotation(df = annotation)
Heatmap(mat, top_annotation = annotation)

annotation = data.frame(value = rnorm(10))
value = 1:10
ha = HeatmapAnnotation(df = annotation, points = anno_points(value), 
    annotation_height = c(1, 2))
Heatmap(mat, top_annotation = ha, top_annotation_height = unit(2, "cm"), 
    bottom_annotation = ha)

# character matrix
mat3 = matrix(sample(letters[1:6], 100, replace = TRUE), 10, 10)
rownames(mat3) = {x = letters[1:10]; x[1] = "aaaaaaaaaaaaaaaaaaaaaaa";x}
Heatmap(mat3, rect_gp = gpar(col = "white"))

mat = matrix(1:9, 3, 3)
rownames(mat) = letters[1:3]
colnames(mat) = letters[1:3]

Heatmap(mat, rect_gp = gpar(col = "white"), 
    cell_fun = function(i, j, x, y, width, height, fill) {
        grid.text(mat[i, j], x = x, y = y)
    },
    cluster_rows = FALSE, cluster_columns = FALSE, row_names_side = "left", 
    column_names_side = "top")

}
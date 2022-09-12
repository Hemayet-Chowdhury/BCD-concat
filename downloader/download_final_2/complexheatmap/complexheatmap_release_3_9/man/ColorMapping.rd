\name{ColorMapping}
\alias{ColorMapping}
\title{
Constructor Method for ColorMapping Class
}
\description{
Constructor Method for ColorMapping Class
}
\usage{
ColorMapping(name, colors = NULL, levels = NULL,
    col_fun = NULL, breaks = NULL, na_col = "#FFFFFF")
}
\arguments{

  \item{name}{Name for this color mapping. The name is automatically generated if it is not specified.}
  \item{colors}{Discrete colors.}
  \item{levels}{Levels that correspond to \code{colors}. If \code{colors} is name indexed, \code{levels} can be ignored.}
  \item{col_fun}{Color mapping function that maps continuous values to colors.}
  \item{breaks}{Breaks for the continuous color mapping. If \code{col_fun} is generated by \code{\link[circlize]{colorRamp2}}, \code{breaks} is automatically inferred from the color mapping function.}
  \item{na_col}{Colors for \code{NA} values.}

}
\details{
\code{colors} and \code{levels} are used for discrete color mapping, \code{col_fun} and
\code{breaks} are used for continuous color mapping.
}
\value{
A \code{\link{ColorMapping-class}} object.
}
\author{
Zuguang Gu <z.gu@dkfz.de>
}
\examples{
cm = ColorMapping(colors = c("A" = "red", "B" = "black"))
cm
require(circlize)
col_fun = colorRamp2(c(0, 1), c("white", "red"))
cm = ColorMapping(col_fun = col_fun)
}
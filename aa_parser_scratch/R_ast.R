



p <- parse(
  text = 'setMethod("DModX", "pcaRes",
          function(object, dat, newdata=FALSE, type=c("normalized","absolute"), ...) {
            type <- match.arg(type)
            if(missing(dat)) {
              if(!is.null(completeObs(object)))
                dat <- completeObs(object)
              else stop("missing data when calculating DModX")
            }
            A0 <- as.integer(centered(object))
            ny <- ifelse(newdata, 1,
                         sqrt(nObs(object) /
                              (nObs(object) - nP(object) - A0)))
            E2 <- resid(object, dat)^2
            s <- sqrt(rowSums(E2) / (nVar(object) - nP(object))) * ny
            if(type == "absolute")
              return(s)
            s0 <- sqrt(sum(E2) / ((nObs(object) - nP(object) - A0) *
                                  (nVar(object) - nP(object))))
            s / s0
          })

'
);
library(xmlparsedata);
xml <- xml_parse_data(p, pretty = TRUE);
cat(xml)
import gql from 'graphql-tag';

export default gql`
  query PanelQuery($panelId: Int!) {
    panel: panelById(id: $panelId) {
      id
      pin
      name
      blind
      texture
      startTime
      endTime
      timeLimitSeconds
      public
      hideReviews
      producerId

      averageReviewDurationSeconds
      totalReviewDurationSeconds

      panelists {
        nodes {
          id
          name
          email
          dateOfBirth
          phoneNumber
          gender
          socioEconomicStatus
          userCategory
          interfaceLanguage
          totalProductReviews: productReviewsByUserId {
            totalCount
          }
          panelProductReviews: productReviewsByUserId(
            condition: { panelId: $panelId }
          ) {
            totalCount
            nodes {
              productId
              startTime
              endTime
              astringent
              bitter
              coldFinish
              dairy
              dry
              earthy
              floral
              fruits
              gamey
              herbaceous
              marine
              meaty
              mineral
              mouthfeel
              nutsAndSeeds
              retronasal
              rich
              roasted
              smoked
              sourAndAcidity
              spices
              sugar
              wet
              woody
              referenceFlavors
              appRevision
              product: productByProductId {
                id
                name
              }
              dataQuality: dataQualityByReviewId {
                timeTaken
                allGgVar
                ggVarMax
                insufficientGgVar
                noRefFlavor
                excessiveRefFlavor
                shortReviewTime
                buttonMashing
                noGgVar
              }
            }
          }
        }
      }

      panelProducts: panelProductsByPanelId {
        nodes {
          productReviews {
            totalCount
          }
          productByProductId {
            id
            name
          }
        }
      }

      productReviews: productReviewsByPanelId {
        totalCount
        nodes {
          userId
          startTime
          endTime
          astringent
          bitter
          coldFinish
          dairy
          dry
          earthy
          floral
          fruits
          gamey
          herbaceous
          marine
          meaty
          mineral
          mouthfeel
          nutsAndSeeds
          retronasal
          rich
          roasted
          smoked
          sourAndAcidity
          spices
          sugar
          wet
          woody
          referenceFlavors
        }
      }
    }
  }
`;

import React from 'react'
import { Bar } from 'react-native-progress'
import { Container, Text, Card, CardItem } from 'native-base'

import SwipeCards from 'react-native-swipe-cards'
import Analytics from '@aws-amplify/analytics'

import { connect } from 'react-redux'
import { lifecycle, compose, withState, withHandlers } from 'recompose'

import { View } from 'react-native'
import styled from 'styled-components'

import { bindActionCreators } from '../../../utils/reduxUtils'
import { cardsSelector } from '../../../containers/cards/selector'
import FlipCard from 'react-native-flip-card'

const shuffle = (a: Array<Object>) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QuizScreen = ({
  cards,
  cardsList,
  setCards,
  setInitialCardsNumber,
  initialCardsNumber,
  navigation,
}) => {
  const lessonDetails = navigation.getParam('lessonDetails')

  console.log('lessonDetails', lessonDetails)

  const handleSwipeLeft = item => {
    setCards(shuffle([...cards]))

    Analytics.record({
      name: 'Swipe left - difficult',
      attributes: {
        lessonId: lessonDetails.id,
        lessonTitle: lessonDetails.title,
        cardId: item.id,
        ask: item.ask,
      },
    })
  }

  const handleSwipeRight = item => {
    setCards(cards.slice(1))

    Analytics.record({
      name: 'Swipe right - easy',
      attributes: {
        lessonId: lessonDetails.id,
        lessonTitle: lessonDetails.title,
        cardId: item.id,
        ask: item.ask,
      },
    })
  }

  const handleSwipeUp = item => {
    setCards(shuffle([...cards, item, item]))
    setInitialCardsNumber((initialCardsNumber += 2))

    Analytics.record({
      name: 'Swipe up - very hard',
      attributes: {
        lessonId: lessonDetails.id,
        lessonTitle: lessonDetails.title,
        cardId: item.id,
        ask: item.ask,
        // lesson Id
      },
    })
  }

  return (
    <Container>
      {Array.isArray(cards) && (
        <SwipeCards
          cards={cards}
          // containerStyle={{ padding: 62, borderWidth: 5, borderColor: 'red' }}
          renderCard={item => (
            <Card
              style={{
                // flex: 1,
                height: 300,
                width: 300,
                // margin: 64,
                //
                // borderWidth: 1,
                // borderRadius: 2,
                // borderColor: '#ddd',
                // borderBottomWidth: 0,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.8,
                // shadowRadius: 2,
                // elevation: 1,
              }}
            >
              <CardItem
                cardBody
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FlipCard
                  style={{
                    flex: 1,
                    borderColor: 'transparent',
                    width: 350,
                    elevation: 3,
                  }}
                  friction={6}
                  perspective={1000}
                  flipVertical
                  flip={false}
                  clickable
                >
                  <CardFace>
                    <Text>{item.ask}</Text>
                  </CardFace>

                  <CardBack>
                    <Text>{item.answer}</Text>
                  </CardBack>
                </FlipCard>
              </CardItem>
            </Card>
          )}
          renderNoMoreCards={() => (
            <View>
              <Text>No more cards</Text>
            </View>
          )}
          handleYup={handleSwipeRight}
          handleNope={handleSwipeLeft}
          handleMaybe={handleSwipeUp}
          hasMaybeAction
          yupText="Ok 👌"
          nopeText="Repeat 🤔"
          maybeText={'It is really hard! 🤯'}
          onClickHandler={() => {}}
        />
      )}

      <BottomView>
        <Bar
          progress={
            initialCardsNumber && cards
              ? (initialCardsNumber - cards.length) / initialCardsNumber
              : 0
          }
          width={200}
        />
        <Text>{`${initialCardsNumber -
          cards.length}/${initialCardsNumber}`}</Text>
      </BottomView>
    </Container>
  )
}

const CardFace = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 3px solid blue;
  border-radius: 3px;
`

const BottomView = styled.View`
  /* flex: 0; */
  justify-content: center;
  align-items: center;
  height: 50px;
  /* border: 1px dashed red; */
`

const CardBack = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 3px solid red;
  border-radius: 3px;
`

const mapStateToProps = state => ({
  cardsList: cardsSelector(state),
})

const mapDispatchToProps = bindActionCreators({
  // removeCard: cardId => CardsActions.removeCardRequest(cardId),
})

export default compose(
  withState('cards', 'setCards', ''),
  withState('initialCardsNumber', 'setInitialCardsNumber', 0),
  withHandlers({
    changeAsk: ({ setCards }) => () => setCards(cards => cards),
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.setCards(this.props.cardsList)
      this.props.setInitialCardsNumber(this.props.cardsList.length)
    },
  }),
)(QuizScreen)

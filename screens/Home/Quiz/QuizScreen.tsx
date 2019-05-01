import React from 'react'
import { Bar } from 'react-native-progress'
import {
  Container,
  Content,
  Text,
  DeckSwiper,
  Card,
  CardItem,
} from 'native-base'

import { ListView, Alert } from 'react-native'

import { connect } from 'react-redux'
import {
  lifecycle,
  compose,
  withState,
  withHandlers,
  withPropsOnChange,
} from 'recompose'

import { View } from 'react-native'
import styled from 'styled-components'

import { bindActionCreators } from '../../../utils/reduxUtils'
import { cardsSelector } from '../../../containers/cards/selector'
import FlipCard from 'react-native-flip-card'

const QuizScreen = ({
  // navigation,
  removeLesson,
  cards,
  cardsList,
  setCards,
  getCards,
  removeCard,
  changeProgress,
}) => {
  const handleSwipeLeft = item => {
    console.log('item', item)
  }

  const handleSwipeRight = item => {
    console.log('item', item)
    const updatedCards = cards.filter(card => card.id !== item.id)
    setCards(updatedCards)
    console.log('handle', updatedCards, cards, cardsList)
    // changeProgress()
  }

  console.log('->', cards)
  console.log('-->', cardsList)
  return (
    <Container>
      <Content
        padder
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <DeckSwiper
          dataSource={Array.isArray(cards) ? cards : cardsList}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          renderItem={item => (
            <Card
              style={{
                flex: 1,
                height: 500,
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
                  clickable={true}
                  onFlipEnd={isFlipEnd => {
                    console.log('isFlipEnd', isFlipEnd)
                  }}
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
        />
      </Content>
      <BottomView>
        <Bar progress={0.3} width={200} />
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
  withState('progress', 'calculateProgress', 0),
  withHandlers({
    changeAsk: ({ setCards }) => () => setCards(cards => cards),
    changeProgress: ({ cards, cardsList, calculateProgress }) => () =>
      calculateProgress(cards.length / cardsList.length),
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  // withPropsOnChange(),
  lifecycle({
    componentDidMount() {
      // const { id } = this.props.navigation.getParam('lesson')
      this.props.setCards(this.props.cardsList)
      console.log(this.props.cards)
    },
  }),
)(QuizScreen)

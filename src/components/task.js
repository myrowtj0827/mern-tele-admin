import React from 'react';
import Item from './item'
import styled from 'styled-components'
import {Droppable} from 'react-beautiful-dnd';

function Task(props) {
    const {toDo} = props;
    const StyledContainer = styled.div`
   // background-color: #E0FFFF;
   padding: 15px;
   width: 100%;
  `;
    let taskHandler = (entity) => {
        return entity.map((item, index) => <Item key={index} index={index} item={item['title']} bgColor={item['color']}/>)
    };

    return (
        <Droppable droppableId={toDo.id}>
            {
                provided => (
                    <StyledContainer
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        <h2 style={{margin: '20px', textAlign: 'center'}}>{toDo['title']}</h2>
                        {taskHandler(toDo['list'])}
                        {provided.placeholder}
                    </StyledContainer>
                )
            }
        </Droppable>
    );
}

export default Task;
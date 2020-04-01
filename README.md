# Intro

This is a event based calendar for react

# Setup

    npm install react-calendar-basic
    yarn add react-calendar-basic

## Use

    import React from  'react'
    import Calendar from  'react-calendar-basic'
    import  'react-calendar-basic/dist/style/styles.css'

    function  App() {
    	const  onClickedEvent  =  e  =>  {
    		console.log(e)
    	}
    	const  onSelect  =  e  =>  {
    		console.log(e)
    	}
    	const  onNavigation  =  e  =>  {
    		console.log(e)
    	}
    	const  onViewChange  =  e  =>  {
    		console.log(e)
    	}
    	const  events  =  [{
    		start:  new  Date('2020-03-31T19:50:00+03:00'),
    		end:  new  Date('2020-03-31T21:10:00+03:00'),
    		title:  'Example event'
    		}]
    	return (
    		<div  className='App'>
    			<Calendar
    			defaultView={'month'}
    			onNavigation={onNavigation}
    			onViewChange={onViewChange}
    			events={events}
    			onSelect={onSelect}
    			onClickedEvent={onClickedEvent}
    			/>
    		</div>
    		)
    }
    export  default  App

# Props

| Prop           | Required | Type     | Description                                                                     |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------- |
| onNavigation   | True     | Function | Callback funciton triggered when navigation happens                             |
| onNavigation   | True     | Function | Callback funciton triggered when navigation happens                             |
| onViewChange   | True     | Function | Callback funciton triggered on view change                                      |
| onSelect       | True     | Function | Calback function triggered when selection ends                                  |
| onClickedEvent | True     | Function | Calback function triggered when selection ends                                  |
| events         | True     | Array    | Array of event object. Event object = {start: Date , end: Date, title: String } |
| default view   | false    | Enum     | One of 'month', 'day', 'week', 'agenda'                                         |  |

# TO DO

    Disable days and hours from the calendar, user style input

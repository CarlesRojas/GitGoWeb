export default class EventsPubSub {
    events = {};

    sub(eventName, func) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(func);
    }

    unsub(eventName, func) {
        if (this.events[eventName])
            for (var i = 0; i < this.events[eventName].length; i++)
                if (this.events[eventName][i] === func) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
    }

    emit(eventName, data) {
        if (this.events[eventName])
            this.events[eventName].forEach(function (func) {
                func(data);
            });
    }
}

/*
#######################################
     EVENTS
#######################################

    {
        event:          onShowTooltip
        desciption:     On a tooltip appearing
        parameters:     { tooltipId }
        tooltipId:      The id of the tooltip being shown
    },

    {
        event:          onCommitSelected
        desciption:     On a commit being selected
        parameters:     { hash }
        hash:           Hash of the commit being selected or "" if the current one is being diselected
    },

    {
        event:          onShowContextMenu
        desciption:     On show the context menu
        parameters:     { actions, mousePos }
        actions:        Array of actions, each with: { name, callback, icon, tooltip }
        mousePos:       The position of the mouse click with: { x, y }
    },

    {
        event:          onShowTooltip
        desciption:     On show the tooltip
        parameters:     { message, instant }
        message:        The message fir the tooltip
        instant:        If true, the tooltip will show without waiting 1s
    },

    {
        event:          onHideTooltip
        desciption:     On hide the tooltip
        parameters:     { }
    },


*/

import React, { useState, useEffect, useRef } from 'react';
import { FiSettings } from 'react-icons/fi';
import './VoiceReader.css';

const VoiceReader = ({ contentRef }) => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1.5);
  const utteranceRef = useRef(null);
  const currentElementIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);
  const highlightedNodeRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const fetchVoices = () => {
      const allVoices = synth.getVoices();
      const frenchVoices = allVoices.filter(voice => voice.lang.startsWith('fr'));
      setVoices(frenchVoices);
      if (frenchVoices.length > 2) {
        setSelectedVoice(frenchVoices[2]);
      }
    };

    fetchVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = fetchVoices;
    }

    const handleBeforeUnload = () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearHighlight();
      setIsReading(false);
      if (contentRef.current) {
        contentRef.current.classList.remove('reading-mode');
      }
    };
  }, [contentRef]);

  useEffect(() => {
    if (isReading && contentRef.current) {
      const elements = getElementsToRead(contentRef.current);
      elements.forEach((el, index) => {
        el.addEventListener('click', () => handleElementClick(index));
      });
      return () => {
        elements.forEach((el) => {
          const newElement = el.cloneNode(true);
          el.replaceWith(newElement);
        });
      };
    }
  }, [isReading, contentRef]);

  const handleVoiceChange = (e) => {
    const selected = voices.find(voice => voice.name === e.target.value);
    setSelectedVoice(selected);
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleStartReading = () => {
    if (!selectedVoice || !contentRef.current) return;

    const elements = getElementsToRead(contentRef.current);
    if (elements.length > 0) {
      readElement(elements[0], 0);
      setIsReading(true);
      if (contentRef.current) {
        contentRef.current.classList.add('reading-mode');
      }
    }
  };

  const handlePauseReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResumeReading = () => {
    if (!selectedVoice || !contentRef.current || !isPaused) return;

    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStopReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      clearHighlight();
      setIsReading(false);
      setIsPaused(false);
      if (contentRef.current) {
        contentRef.current.classList.remove('reading-mode');
      }
    }
  };

  const handleElementClick = (index) => {
    if (!isReading || !selectedVoice || !contentRef.current) return;

    window.speechSynthesis.cancel();
    clearHighlight();

    const elements = getElementsToRead(contentRef.current);
    if (index < elements.length) {
      readElement(elements[index], index);
    }
  };

  const readElement = (element, index) => {
    currentElementIndexRef.current = index;
    currentCharIndexRef.current = 0;
    const utterance = new SpeechSynthesisUtterance(element.innerText);
    utterance.voice = selectedVoice;
    utterance.rate = playbackRate;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        currentCharIndexRef.current = event.charIndex;
      }
      highlightTextAtElement(element, event.charIndex, event.charLength);
    };

    utterance.onend = () => {
      clearHighlight();
      const nextIndex = currentElementIndexRef.current + 1;
      const elements = getElementsToRead(contentRef.current);
      if (nextIndex < elements.length) {
        readElement(elements[nextIndex], nextIndex);
      } else {
        setIsReading(false);
        if (contentRef.current) {
          contentRef.current.classList.remove('reading-mode');
        }
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const getElementsToRead = (container) => {
    const elements = Array.from(container.querySelectorAll('p, ul, li, h2, h3, h4, .admonitionHeading_FzoX'));
    const uniqueElements = elements.filter((el) => {
      return !elements.some((parent) => parent !== el && parent.contains(el));
    });
    return uniqueElements;
  };

  const highlightTextAtElement = (element, start, length) => {
    clearHighlight(); // Clear any previous highlights

    const textNodes = getTextNodes(element);
    let currentCharIndex = 0;
    let highlighted = false;

    textNodes.forEach(node => {
      const nodeLength = node.textContent.length;
      if (start >= currentCharIndex && start < currentCharIndex + nodeLength && !highlighted) {
        const wordBoundaries = findWordBoundaries(node.textContent, start - currentCharIndex, length);
        const startIndex = wordBoundaries.start;
        const endIndex = wordBoundaries.end;
        const before = node.textContent.substring(0, startIndex);
        const highlight = node.textContent.substring(startIndex, endIndex);
        const after = node.textContent.substring(endIndex);

        if (highlight.trim() !== "") { // Ensure the highlight is not empty
          const highlightedNode = document.createElement('span');
          highlightedNode.className = 'highlight';
          highlightedNode.textContent = highlight;

          node.textContent = before;
          node.parentNode.insertBefore(highlightedNode, node.nextSibling);
          if (after) {
            const afterNode = document.createTextNode(after);
            node.parentNode.insertBefore(afterNode, highlightedNode.nextSibling);
          }

          highlighted = true;
          highlightedNodeRef.current = highlightedNode;
        }
      }
      currentCharIndex += nodeLength;
    });
  };

  const clearHighlight = () => {
    if (highlightedNodeRef.current) {
      const parent = highlightedNodeRef.current.parentNode;
      if (parent) {
        const textNode = document.createTextNode(highlightedNodeRef.current.textContent);
        parent.replaceChild(textNode, highlightedNodeRef.current);
        parent.normalize();
      }
      highlightedNodeRef.current = null;
    }
  };

  const getTextNodes = (element) => {
    let textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    return textNodes;
  };

  const findWordBoundaries = (text, start, length) => {
    const end = start + length;
    let startIndex = start;
    let endIndex = end;

    while (startIndex > 0 && !/\s/.test(text[startIndex - 1])) {
      startIndex--;
    }
    while (endIndex < text.length && !/\s/.test(text[endIndex])) {
      endIndex++;
    }

    return { start: startIndex, end: endIndex };
  };

  return (
    <div className="voice-reader">
      <button onClick={isReading ? handleStopReading : handleStartReading}>
        {isReading ? 'Stop Reading' : 'Start Reading'}
      </button>
      {isReading && (
        <>
          <button onClick={isPaused ? handleResumeReading : handlePauseReading}>
            {isPaused ? 'Resume Reading' : 'Pause Reading'}
          </button>
        </>
      )}
      <FiSettings
        className="settings-icon"
        onClick={() => setShowSettings(prev => !prev)}
      />
      {showSettings && (
        <>
          <select onChange={handleVoiceChange} value={selectedVoice?.name || ''}>
            {voices.filter(voice => !voice.name.includes('Google')).map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <label htmlFor="playbackRate">Playback Speed:</label>
          <select id="playbackRate" onChange={handlePlaybackRateChange} value={playbackRate}>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </>
      )}
    </div>
  );
};

export default VoiceReader;

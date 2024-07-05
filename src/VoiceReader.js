import React, { useState, useEffect, useRef, useCallback } from 'react';
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

    const localContentRef = contentRef.current;

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearHighlight();
      setIsReading(false);
      if (localContentRef) {
        localContentRef.classList.remove('reading-mode');
      }
    };
  }, [contentRef]);

  useEffect(() => {
    const contentNode = contentRef.current;
    if (contentNode) {
      contentNode.querySelectorAll('table td').forEach(td => {
        const hasBlockElement = Array.from(td.childNodes).some(child => {
          return child.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|UL|OL|TABLE|FIGURE)$/.test(child.tagName);
        });
        if (!hasBlockElement) {
          const content = Array.from(td.childNodes)
            .map(child => {
              if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
                return child.textContent;
              }
              if (child.nodeType === Node.ELEMENT_NODE) {
                return child.outerHTML;
              }
              return null;
            })
            .filter(Boolean)
            .join('')
            .trim();
          if (content) {
            td.innerHTML = `<p>${content}</p>`;
          }
        }
      });
    }
  }, [contentRef]);

  const highlightTextAtElement = useCallback((element, start, length) => {
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
          if (node.parentNode) {
            node.parentNode.insertBefore(highlightedNode, node.nextSibling);
            if (after) {
              const afterNode = document.createTextNode(after);
              node.parentNode.insertBefore(afterNode, highlightedNode.nextSibling);
            }
          }

          highlighted = true;
          highlightedNodeRef.current = highlightedNode;
        }
      }
      currentCharIndex += nodeLength;
    });
  }, []);

  const readElement = useCallback((element, index) => {
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
  }, [selectedVoice, playbackRate, contentRef, highlightTextAtElement]);

  const handleElementClick = useCallback((index) => {
    if (!isReading || !selectedVoice || !contentRef.current) return;

    window.speechSynthesis.cancel();
    clearHighlight();

    const elements = getElementsToRead(contentRef.current);
    if (index < elements.length) {
      readElement(elements[index], index);
    }
  }, [isReading, selectedVoice, contentRef, readElement]);

  useEffect(() => {
    const localContentRef = contentRef.current;
    if (isReading && localContentRef) {
      const elements = getElementsToRead(localContentRef);
      elements.forEach((el, index) => {
        el.addEventListener('click', () => handleElementClick(index));
      });
      return () => {
        elements.forEach((el) => {
          if (el.parentNode) {
            const newElement = el.cloneNode(true);
            el.parentNode.replaceChild(newElement, el);
          }
        });
        if (localContentRef) {
          localContentRef.classList.remove('reading-mode');
        }
      };
    }
  }, [isReading, contentRef, handleElementClick]);

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

  const getElementsToRead = (container) => {
    const elements = Array.from(container.querySelectorAll('p, ul, li, h2, h3, h4, .admonitionHeading_FzoX'));
    const uniqueElements = elements.filter((el) => {
      return !elements.some((parent) => parent !== el && parent.contains(el));
    });
    return uniqueElements;
  };

  const clearHighlight = () => {
    if (highlightedNodeRef.current) {
      const parent = highlightedNodeRef.current.parentNode;
      if (parent) {
        const textNode = document.createTextNode(highlightedNodeRef.current.textContent);
        if (parent.contains(highlightedNodeRef.current)) {
          parent.replaceChild(textNode, highlightedNodeRef.current);
        }
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

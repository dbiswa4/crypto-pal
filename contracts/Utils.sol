pragma solidity ^0.4.18;

/*
This is library contract. Purpose is to keep commonly used functions which
does not change state in Blockchain to keep at one place so that they can be reused.
*/
library Utils {
    /*
    To find the length of a string passed. It will work for UTF-8 chars as well
    */
    function utfStringLength(string str) 
    public 
    pure
    returns (uint length)
    {
        uint i = 0;
        bytes memory string_rep = bytes(str);

        while (i<string_rep.length)
        {
            if (string_rep[i]>>7==0)
                i += 1;
            else if (string_rep[i]>>5==0x6)
                i += 2;
            else if (string_rep[i]>>4==0xE)
                i += 3;
            else if (string_rep[i]>>3==0x1E)
                i += 4;
            else
                //For safety
                i += 1;

            length++;
        }
    }
}